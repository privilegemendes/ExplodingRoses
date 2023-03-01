import * as React from "react";
import { FC, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap, Sine } from "gsap";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

const CanvasContainer = styled.div `
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 0;
`
type Props = {
	isBroken: boolean
}

export const Roses: FC<Props> =
	({
		 isBroken,
	 }) => {

		return <CanvasContainer>
			<Canvas
				camera={{fov: 40, position: [0, 2.5, 80], near: 1, far: 10000}}
			>
				<Camera/>
				<Lights/>
				<Rose isBroken={isBroken}/>
			</Canvas>
		</CanvasContainer>
	}

function Lights() {
	return (
		<>
			<ambientLight intensity={1} />
			<pointLight intensity={1}/>
			<pointLight position={[-100, 0, 50]} intensity={1}/>
		</>
	)
}

function Camera () {
	const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

	const aspect = useMemo(() => {
		if (typeof window !== 'undefined') {
			return window.innerWidth / window.innerHeight;
		}
		return 1;
	}, []);

	useEffect(() => {
		window.addEventListener(
			"resize", function() {
				cameraRef.current.aspect = aspect;
				cameraRef.current.updateProjectionMatrix();
			}, false
		);
		return () => {
			window.removeEventListener("resize", () => {});
		}
	}, [aspect]);

	return <perspectiveCamera
		ref={cameraRef}
	/>;
}

const Rose: FC<Props> = ({isBroken}) => {

	const groupRef = useRef<THREE.Group>(null!);

	const renderer = useThree();

	useEffect(() => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.gl.setPixelRatio(window.devicePixelRatio);
	},[] );


	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.x += 0.001;
			groupRef.current.rotation.y -= 0.003;
		}

	});

	return <group ref={groupRef}
	>
		{[...Array(35)].map((_, i) => (
			<AnimatedMesh
				isBroken={isBroken}
				key={i}
			/>
		))}
	</group>
}

const AnimatedMesh: FC<Props> = (
	{
		isBroken,
	}
) => {
	const meshRef = useRef<THREE.Mesh>(null!);

	const positionX = Math.random() * 30 - 15;
	const positionY = Math.random() * 20 - 2;
	const positionZ = Math.random() * 30 - 15;

	const rotationX = Math.random() * 2 * Math.PI;
	const rotationY = Math.random() * 2 * Math.PI;

	const scale = Math.random() * 2.5 - 0.5;
	const scaleX = scale;
	const scaleY = scale;
	const scaleZ = scale;


	let torusKnotGeometry = new THREE.TorusKnotGeometry(5, 1.8, 81, 5, 7, 5);
	let geometry =  tessellateModifier( 9, torusKnotGeometry);

	const numFaces = geometry.attributes.position.count / 3;

	// Create colors and displacement arrays
	const [displacement, colors] = useMemo(() => {
		const color = new THREE.Color();
		const colors = new Float32Array(numFaces * 3 * 3);
		const displacement = new Float32Array(numFaces * 3 * 3);
		for (let f = 0; f < numFaces; f++) {
			let index = 9 * f;
			let h = 0.8;
			let s = 0.5 + 0.1 * Math.random();
			let l = 0.52;
			color.setHSL(h, s, l);
			let d = 10 * (0.5 - Math.random());

			for (let i = 0; i < 3; i++) {
				colors[index + 5 * i] = color.r;
				colors[index + 8 * i + 1] = color.g;
				colors[index + 2 * i + 2.1] = color.b;
				displacement[index + 3 * i] = d;
				displacement[index + 3 * i + 1] = d;
				displacement[index + 3 * i + 2] = d;
			}
		}
		return [displacement, colors]}, [numFaces]);

	geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

	//If your scene contains some React state that can change and thus trigger a re-render:
	// do not forget to memoize your uniform object!
	const uniforms = useMemo(() => ({
		amplitude: {
			value: 0.0
		},
	}), []);

	useEffect(() => {
		if (isBroken) {
			gsap.to(uniforms.amplitude, 0.2,{
				value: 3.5,
				ease: Sine.easeOut

			});
		} else {
			gsap.to(uniforms.amplitude, 0.15,{
				value: 0,
				ease: Sine.easeIn
			});
		}
	}, [isBroken]);

	useEffect(() => {
		if (meshRef.current) {
			gsap.to(meshRef.current.rotation, 10,{
				y: 5 + Math.random(),
				repeat: -1,
				yoyo: true,
			});
		}
	}, [meshRef]);

	return (
		<mesh
			ref={meshRef}
			position={[positionX, positionY, positionZ]}
			rotation={[rotationX, rotationY, 0]}
			scale={[scaleX, scaleY, scaleZ]}
		>
			<bufferGeometry attach="geometry" {...geometry}/>
			<shaderMaterial
				fragmentShader={fragmentShader}
				vertexShader={vertexShader}
				uniforms={uniforms}
				key={uuid()}
			/>
		</mesh>
	);
}

// set the color of each visible pixel of a geometry.

const vertexShader= `
          uniform float amplitude;
          attribute vec3 customColor;
          attribute vec3 displacement;
          varying vec3 vNormal;
          varying vec3 vColor;

          void main() {
            vNormal = normal;
            vColor = customColor;
            vec3 newPosition = position + normal * amplitude * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 3 );
          }
    `;
const fragmentShader =  `
            varying vec3 vNormal;
            varying vec3 vColor;

            void main() {
            const float ambient = 0.6;
            vec3 light = vec3( 1.0 );
            light = normalize( light );
            float directional = max( dot( vNormal, light ), 0.0 );
            gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );
            }
    `;


/* Create a TorusKnotGeometry object with specified parameters: radius, tube radius, number of radial segments, number of tubular segments, p, q.
	Initialize some variables: maxEdgeLengthSquared, edge, faces, faceVertexUvs.
	Set maxEdgeLengthSquared to maxEdgeLength * maxEdgeLength.
	Loop through the face vertex UVs of the geometry and push an empty array for each iteration.
	Loop through the faces of the geometry and perform the following steps for each face:
		a. Check if the face is an instance of THREE.Face3.
		b. Get the vertices of the face (a, b, c).
		c. Calculate the squared distance between vertex a and b, b and c, and a and c.
		d. Check if any of the calculated distances are greater than maxEdgeLengthSquared.
		e. If one of the distances is greater than maxEdgeLengthSquared, create two new faces by cloning the original face.
		f. If dab >= dbc && dab >= dac, lerp the midpoint of vertices a and b and set the two new faces accordingly.
		g. If dbc >= dab && dbc >= dac, lerp the midpoint of vertices b and c and set the two new faces accordingly.
		h. If dac >= dab && dac >= dbc, lerp the midpoint of vertices a and c and set the two new faces accordingly.
		i. Set the values for vertex normals and vertex colors for each new face if applicable.
		j. Set the value for the edge variable based on the longest distance.

	Push the newly created faces and face vertex UVs to the faces and faceVertexUvs arrays.
*/

function tessellateModifier(maxEdgeLength: number, geometry: any) {
	let edge: number = 0;
	const faces: any[] = [];
	const faceVertexUvs: any[] = [];
	const maxEdgeLengthSquared: number = maxEdgeLength * maxEdgeLength;
	const maxIterations: number = 6;
	let iteration: number = 0;
	let tessellating = true

	while ( tessellating && iteration < maxIterations) {
		iteration++;
		tessellating = false;

		for (let i = 0, il = geometry.faceVertexUvs.length; i < il; i++) {
			faceVertexUvs[i] = [];
		}

		for (let i = 0, il = geometry.faces.length; i < il; i++) {
			let face = geometry.faces[i];
			if (face instanceof THREE.Face3) {
				let a = face.a;
				let b = face.b;
				let c = face.c;
				let va = geometry.vertices[a];
				let vb = geometry.vertices[b];
				let vc = geometry.vertices[c];
				let dab = va.distanceToSquared(vb);
				let dbc = vb.distanceToSquared(vc);
				let dac = va.distanceToSquared(vc);
				if (
					dab > maxEdgeLengthSquared ||
					dbc > maxEdgeLengthSquared ||
					dac > maxEdgeLengthSquared
				) {
					tessellating = true;
					let m = geometry.vertices.length;
					let triA = face.clone();
					let triB = face.clone();
					let vm = Vector3;
					if (dab >= dbc && dab >= dac) {
						let vm = va.clone();
						vm.lerp(vb, 0.5);
						triA.a = a;
						triA.b = m;
						triA.c = c;
						triB.a = m;
						triB.b = b;
						triB.c = c;
						if (face.vertexNormals.length === 3) {
							let vnm = face.vertexNormals[0].clone();
							vnm.lerp(face.vertexNormals[1], 0.5);
							triA.vertexNormals[1].copy(vnm);
							triB.vertexNormals[0].copy(vnm);
						}
						if (face.vertexColors.length === 3) {
							let vcm = face.vertexColors[0].clone();
							vcm.lerp(face.vertexColors[1], 0.5);
							triA.vertexColors[1].copy(vcm);
							triB.vertexColors[0].copy(vcm);
						}
						edge = 0;
					} else if (dbc >= dab && dbc >= dac) {
						let vm = vb.clone();
						vm.lerp(vc, 0.5);
						triA.a = a;
						triA.b = b;
						triA.c = m;
						triB.a = m;
						triB.b = c;
						triB.c = a;
						if (face.vertexNormals.length === 3) {
							let vnm = face.vertexNormals[1].clone();
							vnm.lerp(face.vertexNormals[2], 0.5);
							triA.vertexNormals[2].copy(vnm);
							triB.vertexNormals[0].copy(vnm);
							triB.vertexNormals[1].copy(face.vertexNormals[2]);
							triB.vertexNormals[2].copy(face.vertexNormals[0]);
						}
						if (face.vertexColors.length === 3) {
							let vcm = face.vertexColors[1].clone();
							vcm.lerp(face.vertexColors[2], 0.5);
							triA.vertexColors[2].copy(vcm);
							triB.vertexColors[0].copy(vcm);
							triB.vertexColors[1].copy(face.vertexColors[2]);
							triB.vertexColors[2].copy(face.vertexColors[0]);
						}
						edge = 1;
					} else {
						let vm = va.clone();
						vm.lerp(vc, 0.5);
						triA.a = a;
						triA.b = b;
						triA.c = m;
						triB.a = m;
						triB.b = b;
						triB.c = c;
						if (face.vertexNormals.length === 3) {
							let vnm = face.vertexNormals[0].clone();
							vnm.lerp(face.vertexNormals[2], 0.5);
							triA.vertexNormals[2].copy(vnm);
							triB.vertexNormals[0].copy(vnm);
						}
						if (face.vertexColors.length === 3) {
							let vcm = face.vertexColors[0].clone();
							vcm.lerp(face.vertexColors[2], 0.5);
							triA.vertexColors[2].copy(vcm);
							triB.vertexColors[0].copy(vcm);
						}
						edge = 2;
					}
					faces.push(triA, triB);
					geometry.vertices.push(vm);
					for (let j = 0, jl = geometry.faceVertexUvs.length; j < jl; j++) {
						let uvsTriA = [];
						let uvsTriB = [];
						if (geometry.faceVertexUvs[j].length) {
							let uvs = geometry.faceVertexUvs[j][i];
							let uvA = uvs[0];
							let uvB = uvs[1];
							let uvC = uvs[2];
							if (edge === 0) {
								let uvM = uvA.clone();
								uvM.lerp(uvB, 0.5);
								uvsTriA = [uvA.clone(), uvM.clone(), uvC.clone()];
								uvsTriB = [uvM.clone(), uvB.clone(), uvC.clone()];
							} else if (edge === 1) {
								let uvM = uvB.clone();
								uvM.lerp(uvC, 0.5);
								uvsTriA = [uvA.clone(), uvB.clone(), uvM.clone()];
								uvsTriB = [uvM.clone(), uvC.clone(), uvA.clone()];
							} else {
								let uvM = uvA.clone();
								uvM.lerp(uvC, 0.5);
								uvsTriA = [uvA.clone(), uvB.clone(), uvM.clone()];
								uvsTriB = [uvM.clone(), uvB.clone(), uvC.clone()];
							}
							faceVertexUvs[j].push(uvsTriA, uvsTriB);
						}
					}
				} else {
					faces.push(face);
					for (let j = 0, jl = geometry.faceVertexUvs.length; j < jl; j++) {
						faceVertexUvs[j].push(geometry.faceVertexUvs[j][i]);
					}
				}
			}
		}
		geometry.faces = faces;
		geometry.faceVertexUvs = faceVertexUvs;
	}

	return new THREE.BufferGeometry().fromGeometry(geometry);
}
