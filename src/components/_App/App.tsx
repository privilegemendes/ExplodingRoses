import * as React from "react";
import { FC, useState } from "react";
import styled from "styled-components";
import { Roses } from "../Roses/Roses";

export const App: FC = () =>
{
	const [isBroken, setIsBroken] = useState<boolean>(false);

	const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement | MouseEvent>) => {
		event.preventDefault();
		setIsBroken(true);
	}
	const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement | MouseEvent>) => {
		event.preventDefault();
		setIsBroken(false);
	}

const onTextClick = () => {
 isBroken === true ? setIsBroken(false): setIsBroken(true)
}

	return <PageCoverWrapper
		onMouseEnter={event => handleMouseEnter(event)}
		onMouseLeave={event => handleMouseLeave(event)}
  onClick={()=> onTextClick()}
	>
		<GlitchSection>
			<Roses isBroken={isBroken}/>
		</GlitchSection>
	</PageCoverWrapper>
}

const GlitchSection = styled.div`
		position: relative;
		z-index: 100;
		height: calc(100vh - 120px);
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		width: 100vw;
		padding: 8vmin 12vmin 8vmin 8vmin;
`;

const PageCoverWrapper = styled.div`
	width: 100vw;
	height: calc(95vh - var(--notion-header-height));
	// min-height: 30vh;
	// max-height: 30vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-image: linear-gradient( 0deg, hsl(210deg 30% 8%) 0%, hsl(210deg 30% 8%) 10%, hsl(359deg 74% 32%) 25%, hsl(0deg 37% 19%) 46%, hsl(359deg 73% 31%) 67%, hsl(0deg 100% 27%) 85%, hsl(210deg 30% 8%) 100% );
`;
