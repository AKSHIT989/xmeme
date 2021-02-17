import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom"; //For redirecting to different pages

import api from "../../services/api"; // For API calls
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardImg,
	CardText,
	CardTitle,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
} from "reactstrap"; //for using pre-built components

//importing assets
import ImageNotFound from "../../assets/ImageNotFound.png";

//functional component
function UpdateMeme() {
	const history = useHistory();

	const memeId = localStorage.getItem("meme-id"); // getting meme-id from localstorage
	const [memeData, setMemeData] = useState({}); // Storing data after fetching

	const [caption, setCaption] = useState(memeData.caption);
	const [url, setUrl] = useState(memeData.url);

	const [alertToggle, setAlertToggle] = useState(false);
	const [alertToggleDanger, setAlertToggleDanger] = useState(false);

	const [error, setError] = useState(true);
	const [errorMessage, setErrorMessage] = useState("no-change");

	useEffect(() => {
		document.title = "Update Meme";
		getMemeDetails();
		return () => {
			setMemeData({});
			setCaption("");
			setUrl("");
		};
	}, []);

	// function to fetch data
	const getMemeDetails = async () => {
		try {
			const response = await api.get(`/memes/${memeId}`); // API to fetch data
			//updating states
			setMemeData(response.data);
			setCaption(response.data.caption);
			setUrl(response.data.url);
		} catch (err) {
			console.log(err);
			setError(true);
			setErrorMessage(err.message + `Please reload page`);
		}
	};

	//validates URL
	const urlHandler = async (event) => {
		try {
			if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null) {
				setUrl(event.target.value);
			}
		} catch (err) {
			console.log(err);
		}
	};

	//Called on submission
	const updationHandler = async (event) => {
		event.preventDefault();
		if (
			caption !== "" && //checks if caption is blank
			/\S/.test(caption) && //checks if caption is filled with spaces
			url !== "" && // checks if url is blank
			/\S/.test(url) != null //checks if url is filled with spaces
		) {
			//checks if any change is present
			if (caption !== memeData.caption || url !== memeData.url) {
				//changes present
				if (
					//checks for valid url
					url.match(/\.(jpeg|jpg|gif|png)$/) != null &&
					errorMessage !== "Invalid url"
				) {
					try {
						await api.patch(`/memes/${memeId}`, {
							//PATCH Request to update meme
							caption: caption,
							url: url,
						});
					} catch (error) {
						setError(true);
						setErrorMessage(error.message);
						console.log(error);
					}

					setError(false);
					setAlertToggle(true);
					setTimeout(() => {
						setAlertToggle(false);
						history.push("/"); //redirect to home page
						localStorage.removeItem("meme-id"); // remove meme-id from local storage
					}, 2500);
				} else {
					//error invalid URL
					setError(true);
					setAlertToggleDanger(true);
					setErrorMessage("Invalid url");
					setTimeout(() => {
						setAlertToggleDanger(false);
					}, 2500);
				}
			} else {
				//error no change found
				setError(true);
				setAlertToggleDanger(true);
				setErrorMessage("No change found");
				setTimeout(() => {
					setAlertToggleDanger(false);
				}, 2500);
			}
		} else {
			setError(true);
			setAlertToggleDanger(true);
			setErrorMessage("Missing required information");
			setTimeout(() => {
				setAlertToggleDanger(false);
			}, 2500);
		}
	};
	return (
		<>
			{Object.keys(memeData).length === 0 ? (
				<center>
					{/* LOADER until data is fetched */}
					<div className="loader"></div>
					Fetching Data...
				</center>
			) : (
				<>
					<Container>
						<h1 className="text-center body-title">Update meme</h1>
						<Row xs="1" md="2">
							<Col className="column">
								<Form onSubmit={updationHandler}>
									<FormGroup>
										{/* NAME field */}
										<Label for="exampleEmail">Meme Owner</Label>
										<Input
											type="text"
											name="email"
											id="exampleEmail"
											placeholder="Enter your full name"
											defaultValue={memeData.name}
											disabled
										/>
									</FormGroup>
									<FormGroup>
										{/* CAPTION field */}
										<Label for="exampleText">
											Meme Caption <sup>*</sup>
										</Label>
										<Input
											type="textarea"
											name="text"
											id="exampleText"
											placeholder="Be creative with the caption"
											defaultValue={caption}
											onChange={(event) => setCaption(event.target.value)}
										/>
									</FormGroup>
									<FormGroup>
										{/* URL field */}
										<Label for="exampleEmail">
											Meme URL <sup>*</sup>{" "}
										</Label>
										<Input
											type="url"
											name="email"
											id="exampleEmail"
											placeholder="Enter URL of your meme here"
											defaultValue={url}
											onChange={urlHandler}
										/>
										{/* Random MEME Generator */}
										<Button
											color="danger"
											size="sm"
											onClick={() => {
												fetch("https://api.imgflip.com/get_memes")
													.then((response) => {
														return response.json();
													})
													.then((data) => {
														const random = Math.floor(Math.random() * 100);
														const meme = data.data.memes[random];
														setUrl(meme.url);
													})
													.catch((err) => {
														setError(true);
														setAlertToggleDanger(true);
														setErrorMessage("Sorry image can't be fetched");
														setTimeout(() => {
															setAlertToggleDanger(false);
														}, 2500);
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
									{/* UPDATE Button */}
									<Button color="success" size="lg" block type="submit">
										Update
									</Button>

									{/* CANCEL Button */}
									<Button
										outline
										color="danger"
										size="lg"
										block
										onClick={() => {
											localStorage.removeItem("meme-id");
											history.push("/");
										}}
									>
										Cancel
									</Button>
								</Form>
								{error ? (
									<Alert color="danger" isOpen={alertToggleDanger}>
										{/* ERROR alert */}
										{errorMessage}
									</Alert>
								) : (
									<Alert color="success" isOpen={alertToggle}>
										{/* SUCCESS alert */}
										Meme Updated succesfully
									</Alert>
								)}
							</Col>

							{/* A preview feature for the meme card */}
							<Col className="column">
								<Card className="dashboard-card">
									<CardBody>
										<CardTitle tag="h5" defaultValue="Your name">
											{memeData.name}
										</CardTitle>
										<CardText>{caption}</CardText>
									</CardBody>
									<CardImg
										top
										width="100%"
										src={url}
										alt="Meme image"
										onError={(event) => {
											event.target.src = ImageNotFound;
											setError(true);
											setAlertToggleDanger(true);
											setErrorMessage("Invalid url");
											console.log(errorMessage);
											setTimeout(() => {
												setAlertToggleDanger(false);
											}, 2500);
										}}
									/>
								</Card>
							</Col>
						</Row>
					</Container>
				</>
			)}
		</>
	);
}

export default UpdateMeme;
