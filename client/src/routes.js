import React from "react";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./components/NavigationBar";

import Dashboard from "./views/Dashboard/Dashboard"; // Home page for displaying memes
import CreateMeme from "./views/CreateMeme/CreateMeme"; // Used for posting a meme
import UpdateMeme from "./views/UpdateMeme/UpdateMeme"; // Used for updating a meme
import AboutMe from "./views/AboutMe/AboutMe"; // About me page for rendering AKSHIT SONEJI information

function routes() {
	return (
		<>
			<Navbar /> {/* Navbar common for all pages */}
			<BrowserRouter>
				<Switch>
					<Route exact path="/post-meme">
						<CreateMeme />
					</Route>
					<Route exact path="/update-meme">
						<UpdateMeme />
					</Route>
					<Route exact path="/about-me">
						<AboutMe />
					</Route>
					<Route exact path="/">
						<Dashboard />
					</Route>
					<Redirect to={{ pathname: "/" }} />{" "}
					{/*Used for redirecting to any invalid url to home page */}
				</Switch>
			</BrowserRouter>
		</>
	);
}

export default routes;
