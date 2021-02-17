import React, { useState } from "react";
import {
	Container,
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from "reactstrap";

function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false); //state for toggle

	const toggle = () => setIsOpen(!isOpen); //toggle for burger menu

	return (
		<Navbar dark expand="md" sticky="true" className="color-nav">
			<Container>
				<NavbarBrand href="/" id="navbar-logo">
					Xmeme
				</NavbarBrand>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="mr-auto" navbar>
						<NavItem>
							<NavLink href="/post-meme">Post Meme</NavLink>
						</NavItem>
					</Nav>
					<NavLink href="/about-me" style={{ marginLeft: "-1rem" }}>
						Made by Akshit Soneji
					</NavLink>
				</Collapse>
			</Container>
		</Navbar>
	);
}

export default NavigationBar;
