import React, { useEffect } from "react";

// Importing components from Reactstrap
import {
	Button,
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	Col,
	Container,
	Row,
} from "reactstrap";

// Importing assets
import AkshitGIF from "../../assets/akshitGithub.gif";

//Functional component
function AboutMe() {
	useEffect(() => {
		//changing title of the page when loaded
		document.title = "About me";
	}, []);

	return (
		<>
			<h1 className="text-center body-title">About me</h1> {/* Title */}
			<Container>
				<Card className="dashboard-card">
					<CardImg top width="100%" src={AkshitGIF} alt="Meme image" />
					<CardBody>
						<CardTitle tag="h3" className="text-center">
							Akshit Soneji
						</CardTitle>
						<CardText>
							I am 19 and a 6th Sem Computer Engineering Student at Charusat
							University 🎓, Web Team at AWS-Students' Club🤹🏻‍♂️ also a Full Stack
							Web Dev Enthusiast ⚡
						</CardText>
						<CardText>
							I am currently working on 2 live projects and I have a CGPA of
							9.75 with 10/10 SGPA in two semesters.
						</CardText>

						<Row xs="2" xl="4" className="text-center">
							<Col className="py-2">
								<Button // GITHUB Link
									color="primary"
									block
									onClick={() => {
										window.open("https://github.com/AKSHIT989", "_blank");
									}}
								>
									<i className="fa fa-github" aria-hidden="true"></i> GitHub
								</Button>
							</Col>
							<Col className="py-2">
								<Button // LinkedIn Link
									color="primary"
									block
									onClick={() => {
										window.open(
											"https://www.linkedin.com/in/akshit-soneji/",
											"_blank"
										);
									}}
								>
									<i className="fa fa-linkedin" aria-hidden="true"></i> LinkedIn
								</Button>
							</Col>
							<Col className="py-2">
								<Button // Resume Link
									color="primary"
									block
									onClick={() => {
										window.open(
											"https://drive.google.com/file/d/1bTfrUubeUffcPLIhIHdIXEu--RXiSbiy/view?usp=sharing",
											"_blank"
										);
									}}
								>
									<i className="fa fa-eye" aria-hidden="true"></i> RESUME{" "}
								</Button>
							</Col>
							<Col className="py-2">
								<Button // Mail link
									color="primary"
									block
									onClick={() =>
										(window.location.href = "mailto: sonejiakshit989@gmail.com")
									}
								>
									<i className="fa fa-envelope" aria-hidden="true"></i> E-mail
								</Button>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Container>
		</>
	);
}

export default AboutMe;
