import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; //used for redirection on submit and cancel
import api from "../../services/api"; //used for api calls
import {
	Alert,
	Button,
	Card,
	CardImg,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
} from "reactstrap";

//importing assets
import ImageNotFound from "../../assets/ImageNotFound.png";

//functional component
function CreateEvent() {
	const history = useHistory();

	useEffect(() => {
		//used for changing title on render
		document.title = "Post-Meme";
	}, []);

	// Declaring state variables

	// states for data fields to be stored
	const [name, setName] = useState("Your name here");
	const [caption, setCaption] = useState("Meme caption");
	const [url, setUrl] = useState(ImageNotFound);

	const [trigger, setTrigger] = useState(false); // used for checking if random image is clicked because for first time the url input field will contain address of ImageNotFound (not to be shown)

	//used for making alert
	const [alertToggle, setAlertToggle] = useState(false); //success alert
	const [alertToggleDanger, setAlertToggleDanger] = useState(false); //error alert

	const [error, setError] = useState(true); // In case of any error
	const [errorMessage, setErrorMessage] = useState("missing-information"); //to set error message

	const submissionHandler = async (event) => {
		// Called when submit is clicked
		event.preventDefault();

		if (
			name !== "" && // Checks if NAME is empty
			/\S/.test(name) && // Checks if NAME is filled with spaces
			name !== "Your name here" && // Checks if NAME is just default value
			caption !== "" && // Checks if CAPTION is empty
			/\S/.test(caption) && // Checks if CAPTION is filled with spaces
			caption !== "Meme caption" && // Checks if CAPTION is just default value
			url !== "" && // Checks if URL is empty
			url !== ImageNotFound && // Checks if CAPTION is just default value
			/\S/.test(url) // Checks if URL is filled with spaces
		) {
			if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null) {
				//validates url points to img only
				try {
					await api.post("/memes", {
						//api call for posting meme
						name,
						caption,
						url,
						date: new Date(),
					});

					// Create success alert which shows up for 2.5 sec and redirects to homepage
					setAlertToggle(true);
					setTimeout(() => {
						setAlertToggle(false);
						history.push("/");
					}, 2500);
					setError(false);
				} catch (err) {
					// 409 error
					setError(true);
					setAlertToggleDanger(true);
					setTimeout(() => {
						setAlertToggleDanger(false);
					}, 2500);
					setErrorMessage("Meme already Exists");
				}

				if (error) {
				} else {
					setAlertToggle(true);
					setTimeout(() => {
						setAlertToggle(false);
						history.push("/");
					}, 2500);
					setError(false);
				}
			} else {
				// If url is invalid
				setError(true);
				setAlertToggleDanger(true);
				setTimeout(() => {
					setAlertToggleDanger(false);
				}, 2500);
				setErrorMessage("Invalid URL");
			}
		} else {
			//If any of the fields is blank
			setAlertToggleDanger(true);
			setTimeout(() => {
				setAlertToggleDanger(false);
			}, 2500);
			setError(true);
			setErrorMessage("Missing information");
		}
	};
	return (
		<Container>
			<h1 className="text-center body-title">Post a meme</h1>
			<Row xs="1" md="2">
				<Col className="column">
					<Form onSubmit={submissionHandler}>
						<FormGroup>
							{/* NAME field */}
							<Label for="meme-owner">
								Meme Owner <sup>*</sup>{" "}
							</Label>
							<Input
								type="text"
								name="name"
								id="meme-owner"
								placeholder="Enter your full name"
								onChange={(event) => {
									setName(event.target.value);
								}}
							/>
						</FormGroup>
						<FormGroup>
							{/* Caption field */}
							<Label for="meme-caption">
								Meme Caption <sup>*</sup>
							</Label>
							<Input
								type="textarea"
								name="text"
								id="meme-caption"
								placeholder="Be creative with the caption"
								onChange={(event) => {
									setCaption(event.target.value);
								}}
							/>
						</FormGroup>
						<FormGroup>
							{/* URL field */}
							<Label for="meme-url">
								Meme URL <sup>*</sup>{" "}
							</Label>
							{trigger === true ? (
								<Input // the url should change after random meme generation
									type="url"
									name="email"
									id="meme-url"
									placeholder="Enter URL of your meme here"
									onChange={(event) => {
										if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null)
											//validates url
											setUrl(event.target.value);
									}}
									value={url}
								></Input>
							) : (
								<Input //the value should be IMAGENOTFOUND until random meme is generated
									type="url"
									name="email"
									id="meme-url"
									placeholder="Enter URL of your meme here"
									onChange={(event) => {
										if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null)
											//validates the url
											setUrl(event.target.value);
									}}
								></Input>
							)}
							<Button //for generating random memes
								color="danger"
								size="sm"
								onClick={() => {
									fetch("https://api.imgflip.com/get_memes") //api call for fetching random memes
										.then((response) => {
											return response.json();
										})
										.then((data) => {
											const random = Math.floor(Math.random() * 100);
											const meme = data.data.memes[random];
											setUrl(meme.url);
											setTrigger(true);
										});
								}}
							>
								{" "}
								Generate Random Meme
							</Button>
							<h6 className="url-warning">
								Make sure the endpoint points to image only
							</h6>
						</FormGroup>
						{/* Submit button */}
						<Button color="success" size="lg" block type="submit">
							Submit
						</Button>
						{/* Cancel button */}
						<Button
							outline
							color="danger"
							size="lg"
							block
							onClick={() => history.push("/")}
						>
							Cancel
						</Button>
					</Form>
					{/* Success and error ALERT */}
					{error ? (
						<Alert color="danger" isOpen={alertToggleDanger}>
							{/*Error alert */}
							{errorMessage}
						</Alert>
					) : (
						<Alert color="success" isOpen={alertToggle}>
							{/*Success alert */}
							Meme posted succesfully
						</Alert>
					)}
				</Col>

				{/* A preview feature for the meme card */}
				<Col className="column">
					<Card className="dashboard-card">
						<CardBody>
							<CardTitle tag="h5" defaultValue="Your name">
								{caption}
							</CardTitle>
							<CardSubtitle tag="h6" className="mb-2 text-muted">
								{name}
							</CardSubtitle>
						</CardBody>
						<CardImg top width="100%" src={url} alt="Meme image" />
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default CreateEvent;
