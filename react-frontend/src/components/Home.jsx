import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
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
import MenuIcon from '@mui/icons-material/Menu';
import CameraIcon from '@mui/icons-material/CropOriginalSharp';
import AreaIcon from '@mui/icons-material/GridOnSharp';
import Thumb from "./Thumb";
import '@fontsource/roboto/300.css';


interface Props {
	window?: () => Window;
}

const PAGE_SINGLE_CAM = 'Single';
const PAGE_MULTI_CAM = 'Multi'

function Home(props: Props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = useState(false);

	const [auth, setAuth] = useState(null);
	const [devices, setDevices] = useState({});
	const [areasToIds, setAreasToIds] = useState({});
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [selectedArea, setSelectedArea] = useState(null);
	const [selectedPage, setSelectedPage] = useState(PAGE_SINGLE_CAM)
	
	const elementRef = useRef(null);
	const [mainWidth, setMainWidth]=useState(0);
	
	const nav = useNavigate()

	const drawerWidth = 240;


	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const lookupDevice = (id) => {
		for (var i = 0; i < devices.length; i++) {
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
		let w=elementRef.current.getBoundingClientRect().width;
		if (w>1280)
			w=1280;
		setMainWidth(w);



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

				// Build area list and area/ID map from device list
				// Device names must be formatted as "Area - Name"
				let areas = {};
				let arealist = [];
				for (var i = 0; i < devs.length; i++) {
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
						arealist.push(area);
					}
				}
				setAreasToIds(areas);

				// pick the first device if none stored
				let selDev = getLocalItem("selectedDevice", devs[0].id);
				setSelectedDevice(selDev);

				// pick the first area if none stored
				let selArea = getLocalItem("selectedArea", arealist[0]);
				setSelectedArea(selArea);

	
			})
			.catch((err) => console.log(err));

		let selPage = getLocalItem("selectedPage", PAGE_SINGLE_CAM);
		setSelectedPage(selPage);
	

	}, [nav, setDevices, elementRef])

	const handleLogout = () => {
		localStorage.removeItem('JWT')
		return nav("/login")
	}

	const handleDeviceClick = (event, id) => {
		setSelectedDevice(id);
		localStorage.setItem("selectedDevice", id);
		setMobileOpen(false);
	}

	const handleAreaClick = (event, area) => {
		setSelectedArea(area);
		localStorage.setItem("selectedArea", area);
		setMobileOpen(false);
	}

	const handleMultiClick = (event, id) => {
		// jump to single view of this camera
		setSelectedDevice(id);
		localStorage.setItem("selectedDevice", id);
		setPage(PAGE_SINGLE_CAM);
	}

	const handleSingleClick = (event, id) => {
		// find the area that contains this camera and show multi-view

		for (const area in areasToIds) {
			const ids = areasToIds[area];
			if (ids.includes(id)) {
				setSelectedArea(area);
				localStorage.setItem("selectedArea", area);
				setPage(PAGE_MULTI_CAM);
				return;
			}
		}

	}

	const drawerContents = (
		<div>
			{selectedPage === PAGE_SINGLE_CAM &&
				<Box>
					<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Cameras</Typography>
					<List dense>
						{
							Object.keys(areasToIds).map((item) => (
								<>
									<ListSubheader sx={{ color: 'green', fontWeight: 'bold', backgroundColor: '#eeeeee' }}>{item}</ListSubheader>
									{areasToIds[item].map((dev) => (
										<ListItem key={dev} disablePadding selected={selectedDevice === dev}>
											<ListItemButton onClick={(event) => handleDeviceClick(event, dev)} >
												<ListItemIcon sx={{ minWidth: '12px', paddingRight: '2px', opacity: '50%' }}><CameraIcon /></ListItemIcon>
												<ListItemText primary={lookupDevice(dev).split(' - ')[1]} />
											</ListItemButton>
										</ListItem>
									))}
								</>
							))

						}

					</List>
				</Box>
			}

			{selectedPage === PAGE_MULTI_CAM &&
				<Box>
					<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Areas</Typography>
					<List>
						{
							Object.keys(areasToIds).map((item) => (
								<ListItem key={item} disablePadding selected={selectedArea === item}>
									<ListItemButton onClick={(event) => handleAreaClick(event, item)} >
										<ListItemIcon><AreaIcon /></ListItemIcon>
										<ListItemText primary={item} secondary={areasToIds[item].length + " cameras"} />
									</ListItemButton>
								</ListItem>
							))
						}

					</List>
				</Box>
			}
		</div>
	)

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex' }} >
			<CssBaseline />
			<Box>
				<AppBar
					position="fixed"
					sx={{
						width: { sm: `calc(100% - ${drawerWidth}px)` },
						ml: { sm: `${drawerWidth}px` },
					}}
					ref={elementRef}

				>
					<Toolbar>

						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { sm: 'none' } }}
						>
							<MenuIcon />
						</IconButton>

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

						<Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
							<IconButton key={PAGE_SINGLE_CAM} sx={{color:'white'}} onClick={() => {setPage(PAGE_SINGLE_CAM)}}><CameraIcon/></IconButton>
							<IconButton key={PAGE_MULTI_CAM} sx={{color:'white'}} onClick={() => {setPage(PAGE_MULTI_CAM)}}><AreaIcon/></IconButton>
						</Box>

						<Box sx={{ flexGrow: 0, display: { xs: 'none'}, marginRight: "10px" }}>
							<Tooltip title={auth ? auth["email"] : ""}><Typography variant="button">{auth ? auth["name"] : ""}</Typography></Tooltip>
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							<IconButton sx={{ p: 0 }}>
								<Avatar alt={auth ? auth["name"] : ""} src={auth ? auth["picture"] : ""} />
							</IconButton>

							<Tooltip title="Logout">
								<IconButton onClick={() => handleLogout()} color="inherit">
									<LogoutIcon />
								</IconButton>
							</Tooltip>

						</Box>

					</Toolbar>

				</AppBar>
			</Box>

			<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawerContents}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open
				>
					{drawerContents}
				</Drawer>
			</Box>


			{selectedPage === PAGE_SINGLE_CAM &&
				<div>
					<Box component="main" sx={{ flexGrow: 1 }}>
						<Toolbar />
						<Thumb id={selectedDevice} name={lookupDevice(selectedDevice)} width={mainWidth - 20} interval="1500" clickCallback={handleSingleClick} user={auth ? auth.email : ""} ></Thumb>
					</Box>
				</div>
			}
			{selectedPage === PAGE_MULTI_CAM &&
				<Box component="main" sx={{ flexGrow: 1 }}>
					<Toolbar />
					<Grid container alignItems="left" justifyContent="left" rowSpacing="1px" columnSpacing="1px" sx={{width: mainWidth - 20}}>
						{
							Object.values(getSelectedAreaIds(selectedArea)).map((item) => (
								<Grid item sx={{ minWidth: 320, justifyContent: 'center' }}>
									<Thumb id={item} name={lookupDevice(item)} width="320" interval="3000" hideTime clickCallback={handleMultiClick} user={auth ? auth.email : ""}></Thumb>
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
