import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import Thumb from "./Thumb";

import '@fontsource/roboto/300.css';

const pages = ['Cameras', 'Logs'];

function Home() {

	const [auth, setAuth] = useState(null);
	const [devices, setDevices] = useState({});
	const [selectedDevice, setSelectedDevice] = useState(null);
	const nav = useNavigate()

	const drawerWidth = 240;


	const lookupDevice = (id) => {
		for (var i=0; i<devices.length; i++) {
			if (devices[i].id === id)
				return devices[i].name;
		}
		return "";
	}

	useEffect(() => {
		if (localStorage.getItem("selectedDevice") == null) {
			setSelectedDevice(null);
		} else {
			setSelectedDevice(localStorage.getItem("selectedDevice"));
		}

		if (localStorage.getItem('JWT') == null) {
			return nav("/login")
		}
		else {
			Axios.get(`${BACKEND_URL}/home`, { headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` } })
				.then((res) => {
					setAuth(res)
				})
				.catch((err) => console.log(err));
		}

		Axios.get(`${BACKEND_URL}/devices`, {
			headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
		})
			.then((res) => {
				setDevices(res.data)
			})
			.catch((err) => console.log(err));

	}, [nav, setDevices])

	const handleLogout = () => {
		localStorage.removeItem('JWT')
		return nav("/login")
	}

	const handleDeviceClick = (event, id) => {
		setSelectedDevice(id);
		localStorage.setItem("selectedDevice", id);
	}

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Box>
				<AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} component="nav">
					<Container maxWidth="xl">
						<Toolbar disableGutters>
							<Typography
								variant="h6"
								noWrap
								component="a"
								sx={{
									mr: 2,
									display: { xs: 'none', md: 'flex' },
									fontFamily: 'sans-serif',
									fontWeight: 700,
									letterSpacing: '-.05rem',
									color: 'orange',
									textDecoration: 'none',
								}}
							>
								MakeIt Labs
							</Typography>

							<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
								{pages.map((page) => (
									<Button
										key={page}
										sx={{ my: 2, color: 'white', display: 'block' }}
									>
										{page}
									</Button>
								))}
							</Box>

							<Box sx={{ flexGrow: 0, marginRight: "10px" }}>
								<Tooltip title={auth ? auth["email"] : ""}><Typography variant="button">{auth ? auth["name"] : ""}</Typography></Tooltip>
							</Box>

							<Box sx={{ flexGrow: 0 }}>
								<IconButton sx={{ p: 0 }}>
									<Avatar alt="Avatar" src={auth ? auth["picture"] : ""} />
								</IconButton>

								<Tooltip title="Logout">
									<IconButton onClick={() => handleLogout()} color="inherit">
										<LogoutIcon />
									</IconButton>
								</Tooltip>

							</Box>

						</Toolbar>


					</Container>
				</AppBar>
			</Box>

			<Box component="nav">
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
						},
					}}
					variant="permanent"
					anchor="left"

				>
					<List dense>

						{
							Object.values(devices).map((item) => (

								<ListItem key={item.id} disablePadding>
									<ListItemButton onClick={(event) => handleDeviceClick(event, item.id)} >
										<ListItemText primary={item.name} />
									</ListItemButton>
								</ListItem>
							))}

					</List>
					<Divider />

				</Drawer>
			</Box>
			<Box component="main" sx={{ p: 3 }}>
				<Toolbar />
				<Thumb id={selectedDevice} name={lookupDevice(selectedDevice)}></Thumb>
			</Box>

		</Box>
	);
}



export default Home;
