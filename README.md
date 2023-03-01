# Three.js Project with React and Tesselation
This is a Three.js project built with React and Tesselation, inspired by Sarah Drasner's project in Vue.js. It uses the react-three-fiber library to integrate Three.js with React and provides a declarative way to create 3D scenes with React components.

## Getting Started
To run the project, first clone the repository:

```bash
git clone https://github.com/<your-username>/react-threejs-tesselation.git
```
Then, install the dependencies:

```bash
cd react-threejs-tesselation
npm install
```
Finally, start the development server:

```bash
npm start
```
The project should now be running on http://localhost:3000/.

## Project Overview
The project is a simple 3D scene with a tesselated surface that can be interacted with using the mouse. The tesselated surface is created using the Three.js TessellateModifier, which subdivides a mesh's faces to create a more detailed surface.

The scene is composed of several React components:

### Scene
The Scene component creates the Three.js scene, camera, and renderer. It also contains the OrbitControls component from react-three-fiber, which allows the user to rotate the camera around the scene.

### TessellatedPlane
The TessellatedPlane component creates a PlaneBufferGeometry and applies the TessellateModifier to it to create the tesselated surface. It also applies a material to the surface and handles mouse interactions by changing the surface's color on hover.

### Light
The Light component creates a PointLight that illuminates the scene.

## Project Structure
```
.
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Light.js
│   │   ├── Scene.js
│   │   └── TessellatedPlane.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```
- public/: Contains the index.html file used as the entry point for the project.
- src/: Contains the source code for the project.
components/: Contains the React components used to create the scene.
- App.js: The main React component that renders the Scene and its children components.
- index.js: The entry point for the React application.
- index.css: The CSS styles for the project.

## Conclusion
This project demonstrates the power of using Three.js with React and how it can provide a declarative way to create 3D scenes. The react-three-fiber library makes it easy to integrate Three.js with React, and the TessellateModifier can be used to create complex surfaces with minimal effort. With these tools, creating 3D scenes in React becomes accessible to developers of all levels.
