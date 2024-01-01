import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NavBar = () => {
	return (
		<AppBar position="static">
			<Toolbar className="flex justify-center">
				<Button component={Link} to="/" color="inherit" className="mx-2">
					Home
				</Button>
				<Button component={Link} to="/raw" color="inherit" className="mx-2">
					Data Table
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
