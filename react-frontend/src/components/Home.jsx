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
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from "@mui/material/ListSubheader";
import Grid from '@mui/material/Grid';
import CameraIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import AreaIcon from '@mui/icons-material/Handyman';
import Thumb from "./Thumb";

import '@fontsource/roboto/300.css';

const pages = ['Single Camera', 'Multi Camera'];

function Home() {

	const [auth, setAuth] = useState(null);
	const [devices, setDevices] = useState({});
	const [areasToIds, setAreasToIds] = useState({});
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [selectedArea, setSelectedArea] = useState(null);
	const [selectedPage, setSelectedPage] = useState('Single Camera')
	const nav = useNavigate()

	const drawerWidth = 240;

	const lookupDevice = (id) => {
		for (var i=0; i<devices.length; i++) {
			if (devices[i].id === id)
				return devices[i].name;
		}
		return "";
	}

	const getSelectedAreaIds = () => {
		if (areasToIds.hasOwnProperty(selectedArea)) {
			return areasToIds[selectedArea];
		}
		return [];
	}

	const setPage = (page) => {
		setSelectedPage(page);
		localStorage.setItem("selectedPage", page);
	}

	let getLocalItem = (name, def) => {
		let val = localStorage.getItem(name);
		if (val === null || val === undefined)
			return def;
		else return val;
	}

	useEffect(() => {
		
		setSelectedArea(getLocalItem("selectedArea", selectedArea))
		setSelectedDevice(getLocalItem("selectedDevice", selectedDevice))
		setSelectedPage(getLocalItem("selectedPage", selectedPage))

		if (localStorage.getItem('JWT') == null) {
			return nav("/login")
		}
		else {
			Axios.get(`${BACKEND_URL}/home`, { headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` } })
				.then((res) => {
					setAuth(res.data)
				})
				.catch((err) => console.log(err));
		}

		Axios.get(`${BACKEND_URL}/devices`, {
			headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
		})
			.then((res) => {
				const devs = res.data
				setDevices(devs)

				let areas = {};
				for (var i=0; i<devs.length; i++) {
					let n = devs[i].name;
					let s = n.split('-');
					if (s.length >= 2) {
						let area = s[0];
						let idlist = [];
						if (areas.hasOwnProperty(area)) {
							idlist = areas[area];
						}
						idlist.push(devs[i].id);
						areas[area] = idlist;
					}
				}
				setAreasToIds(areas);
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

	const handleAreaClick = (event, area) => {
		setSelectedArea(area);
		localStorage.setItem("selectedArea", area);
	}

	const handleMultiClick = (event, id) => {
		setSelectedDevice(id);
		setSelectedPage('Single Camera');
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
										sx={{ color: 'white' }}
										onClick={ () => { setPage(page) } }
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
				{ selectedPage === "Single Camera" &&
					<Box>
						<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Cameras</Typography>
						<List dense>
							{
								/*
								Object.values(devices).map((item) => (
									<ListItem key={item.id} disablePadding selected={ selectedDevice === item.id}>
										<ListItemButton onClick={(event) => handleDeviceClick(event, item.id)} >
											<ListItemIcon sx={{minWidth: '12px', paddingRight: '2px'}}><CameraIcon/></ListItemIcon>
											<ListItemText primary={item.name.split(' - ')[1]} secondary={item.name.split(' - ')[0]} />
										</ListItemButton>
									</ListItem>
								))
								*/
								Object.keys(areasToIds).map((item) => (
									<>
									<ListSubheader>{item}</ListSubheader>
									{areasToIds[item].map( (dev) => (
										<ListItem key={item} disablePadding selected={ selectedDevice === dev}>
											<ListItemButton onClick={(event) => handleDeviceClick(event, dev)} >
											<ListItemIcon sx={{minWidth: '12px', paddingRight: '2px', opacity: '50%'}}><CameraIcon/></ListItemIcon>
												<ListItemText primary={lookupDevice(dev).split(' - ')[1]}/>
											</ListItemButton>
										</ListItem>
									))}
									</>
								))

							}

						</List>
					</Box>
				}

				{ selectedPage === "Multi Camera" &&
					<Box>
						<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Areas</Typography>
						<List>
							{
								Object.keys(areasToIds).map((item) => (
									<ListItem key={item} disablePadding selected={ selectedArea === item }>
										<ListItemButton onClick={(event) => handleAreaClick(event, item)} >
										<ListItemIcon><AreaIcon/></ListItemIcon>
											<ListItemText primary={item} secondary={areasToIds[item].length + " cameras"}/>
										</ListItemButton>
									</ListItem>
								))
							}

						</List>
					</Box>
				}				
				</Drawer>
			</Box>
			{ selectedPage === "Single Camera" &&
				<Box component="main" sx={{ p: 3 }}>
					<Toolbar />
					<Thumb id={selectedDevice} name={lookupDevice(selectedDevice) } height="720" interval="1500"></Thumb>
				</Box>
			}	
			{ selectedPage === "Multi Camera" &&
				<Box component="main" sx={{ backgroundColor: '#333333', paddingBottom: "20px"}}>
					<Toolbar />
					<Grid container direction="row" alignItems="flex-start" justifyItems="flex-start" rowSpacing="4px" columnSpacing="4px" >
							{
								Object.values(getSelectedAreaIds(selectedArea)).map((item) => (
									<Grid item sx={{height: 201, minWidth: 380}}>
										<Thumb id={item} name={lookupDevice(item) } height="200" interval="3000" hideTime clickCallback={handleMultiClick}></Thumb>
									</Grid>
								))
							}
					</Grid>

				</Box>
			}	

		</Box>
	);
}



export default Home;
