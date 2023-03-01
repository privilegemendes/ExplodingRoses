import * as React from "react";
import { FC } from "react";
import { ExplodingRoses } from "../Roses/ExplodingRoses";
import { AppBar, Container, Description, Main, Title } from "../../styles/SharedStyles";
import { Footer } from "../Footer/Footer";
import { GitHubShareButton } from "../GitHubShareButton/GitHubShareButton";

export const App: FC = () =>
{

	return <Container>
		<AppBar>
			<Title>Explosive Roses</Title>
			<Description>
				Exploding Roses using Three.js and React
			</Description>
			<GitHubShareButton/>
		</AppBar>
		<Main>
			<ExplodingRoses/>
		</Main>
		<Footer/>
	</Container>;
}
