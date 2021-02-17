import React, { useEffect, useState } from "react";
import api from "../../services/api"; //used for api calls
import { useHistory } from "react-router-dom"; //used for redirection on edit page
import {
	Alert,
	Button,
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
	Container,
	Row,
} from "reactstrap";

//importing assets
import ImageNotFound from "../../assets/ImageNotFound.png";
import NetworkError from "../../assets/networkError.svg";

// functional component
function Dashboard() {
	let history = useHistory();

	const [memes, setMemes] = useState([]); //for storing data in a state

	const [errorMessage, setErrorMessage] = useState(""); // in case any error occurs

	useEffect(() => {
		document.title = "Dashboard"; // changing document title
		getMemes(); // function to fetch data
	}, []);

	// function to fetch data
	const getMemes = async () => {
		try {
			const response = await api.get("/memes"); // API call for getting data
			setMemes(response.data);
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	// To redirect to update page after clicking edit button
	const UpdationHandler = (id) => {
		localStorage.setItem("meme-id", id); // using local storage to store meme-id
		history.push("/update-meme"); // redirecting to update-meme page
	};

	return (
		<>
			{errorMessage !== "" ? (
				<Container>
					{/* If any error occurs */}
					<center>
						<img
							src={NetworkError}
							width="70%"
							height="70%"
							alt="Network Error"
						/>
						<Alert color="danger">{errorMessage}</Alert>
					</center>
				</Container>
			) : memes.length === 0 ? ( // Loader until data is fetched
				<center>
					<div className="loader"></div>
					Fetching Data...
				</center>
			) : (
				<>
					<h1 className="text-center body-title">Dashboard</h1>
					<Container>
						<Row sm="2" xs="1" xl="3">
							{memes.map((val, key) => {
								return (
									<Col className="column">
										<Card key={key} className="dashboard-card">
											{/* Image */}
											<CardImg
												className="dashboard-cardImage"
												width="300rem"
												height="300rem"
												top
												src={val.url}
												alt="Card image cap"
												onError={(event) => {
													// If src points to any non-image url
													event.target.src = ImageNotFound;
												}}
											/>
											<hr />
											{/* Main content */}
											<CardBody>
												{/* Caption */}
												<CardTitle tag="h5">{val.caption}</CardTitle>{" "}
												{/* Owner Name */}
												<CardText>By: {val.name}</CardText>
												{/* Difference between today and stored date */}
												<CardSubtitle>
													{Math.floor(
														(new Date() - new Date(val.date)) / 86400000
													) > 1 ? (
														<span>
															{/*Here the difference of days is greater than 1 */}
															{Math.floor(
																(new Date() - new Date(val.date)) / 86400000
															)}{" "}
															days ago
														</span>
													) : (
														<span>
															{/*Here the difference of days is less than 1 */}
															{Math.floor(
																((new Date() - new Date(val.date)) % 86400000) /
																	3600000
															)}{" "}
															hours{" "}
															{Math.round(
																(((new Date() - new Date(val.date)) %
																	86400000) %
																	3600000) /
																	60000
															)}{" "}
															minutes ago
														</span>
													)}
												</CardSubtitle>
												{/* Edit button */}
												<Button
													color="info"
													style={{ position: "absolute", top: 0, right: 0 }}
													onClick={() => UpdationHandler(val._id)}
												>
													<i
														class="fa fa-pencil-square-o"
														aria-hidden="true"
													></i>{" "}
													Edit
												</Button>
											</CardBody>
										</Card>
									</Col>
								);
							})}
						</Row>
					</Container>
				</>
			)}
		</>
	);
}

export default Dashboard;
