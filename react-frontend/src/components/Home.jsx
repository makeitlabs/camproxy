import * as React from 'react';
import { useEffect, useState } from "react";
import { BACKEND_URL, DEVEL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import { CssBaseline, Grid, AppBar, Box, Toolbar, IconButton, Typography, Avatar, Tooltip, Drawer, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CameraIcon from '@mui/icons-material/CropOriginalSharp';
import AreaIcon from '@mui/icons-material/GridOnSharp';
import Thumb from "./Thumb";
import '@fontsource/roboto/300.css';

const PAGE_SINGLE_CAM = 'Single Camera';
const PAGE_MULTI_CAM = 'Multi Camera'

const useViewport = () => {
	const [width, setWidth] = React.useState(window.innerWidth);
	React.useEffect(() => {
	  const handleWindowResize = () => { setWidth(window.innerWidth); }
	  window.addEventListener("resize", handleWindowResize);
	  return () => window.removeEventListener("resize", handleWindowResize);
	}, []);
	return { width };
}

function Home(props) {
	const { window } = props;
	const { width } = useViewport();

	const [zoomableOpen, setZoomableOpen] = useState(false);
	const [othersOpen, setOthersOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const [auth, setAuth] = useState(null);
	const [devices, setDevices] = useState({});
	const [areasToIds, setAreasToIds] = useState({});
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [selectedArea, setSelectedArea] = useState(null);
	const [selectedPage, setSelectedPage] = useState(PAGE_SINGLE_CAM);
	const [sessionInfo, setSessionInfo] = useState({});
	const [timerId, setTimerId] = useState(null);


	const nav = useNavigate()

	const wideBreak = 600;
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

		fetchSessionInfo();

        const tid = setInterval(() => {
			fetchSessionInfo();
        }, 10000);
        setTimerId(tid);
        return () => {
            clearInterval(timerId);
        }		

	}, [nav, setDevices])

	const fetchSessionInfo = () => {
		Axios.get(`${BACKEND_URL}/session_info`, {
			headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
		})
			.then((res) => {
				const info = res.data;
				setSessionInfo(info);
			})
			.catch((err) => console.log(err));		
	}

	const getRemainingTime = (i) => {
		if (i !== undefined && i.remaining_time !== undefined) {
			let secs = i.remaining_time;
			if (secs > 3600) {
				let hours = Math.floor(secs / 3600);
				return hours + 'h';
			} else if (secs > 60) {
				let mins = Math.floor(secs / 60);
				return mins + 'm';
			} else {
				return secs + 's';
			}
		}
		return "";
	}

	const renderOthers = (info, listFormat) => {
		if (info !== undefined && info.others !== undefined) {
			if (listFormat !== undefined) {
				return (
					<List>
						
					{
						Object.keys(info.others).map( (osub) => {
							return (<ListItem>
										<Avatar sx={{height: 28, width: 28, ml: '2px', opacity: info.others[osub].session_age > 15 ? '30%' : '100%'}} src={info.others[osub].session_picture}/>
										<Box sx={{ml:1}}>{info.others[osub].session_name}</Box>
									</ListItem>)
						})
					}
					</List>
				);
			} else {
				return (
					<Box sx={{ mr: 2, display: 'flex' }}>
					{
						Object.keys(info.others).map( (osub) => {
							return (<Tooltip title={info.others[osub].session_age > 15 ? "Idle viewer: " + info.others[osub].session_name: "Also viewing: " + info.others[osub].session_name}>
										<Avatar sx={{height: 28, width: 28, ml: '2px', opacity: info.others[osub].session_age > 15 ? '30%' : '100%'}} src={info.others[osub].session_picture}/>
									</Tooltip>)
						})
					}
					</Box>
				);
			}
		}
		return <div/>
	}
	const handleLogout = () => {
		localStorage.removeItem('JWT')
		return nav('/login');
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
		
		setSelectedDevice(id);

		if (width < wideBreak) {
			setZoomableOpen(true);
		} else {
			// jump to single view of this camera

			localStorage.setItem("selectedDevice", id);
			setPage(PAGE_SINGLE_CAM);
		}
	}


	const handleSingleClick = (event, id) => {

		if (width < wideBreak) {
			setZoomableOpen(true);
		} else {
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

	}
	const handleThumbTimeout = () => {
		localStorage.removeItem('JWT')
		return nav('/timeout');
	}

	const drawerContents = (
		<div>
			{selectedPage === PAGE_SINGLE_CAM &&
				<Box>
					<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Cameras</Typography>
					{ Object.keys(areasToIds).length > 0 &&
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
					}
					{ Object.keys(areasToIds).length === 0 &&
						<List dense>
							<ListItem><CircularProgress disableShrink/></ListItem>
							<ListItem>Loading...</ListItem>
						</List>
					}
				</Box>
			}

			{selectedPage === PAGE_MULTI_CAM &&
				<Box>
					<Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Areas</Typography>
					{ Object.keys(areasToIds).length > 0 &&
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
					}
					{ Object.keys(areasToIds).length === 0 &&
						<List dense>
							<ListItem><CircularProgress disableShrink/></ListItem>
							<ListItem>Loading...</ListItem>
						</List>
					}
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
						backgroundColor: `${DEVEL}` === "yes" ? 'gray' : '#1976d2'
					}}
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
								textShadow: '1px 1px 1px black'
							}}
						>
							MakeIt Labs
						</Typography>

						<Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
							<IconButton key={PAGE_SINGLE_CAM}
										sx={{ color:'white', backgroundColor: (selectedPage === PAGE_SINGLE_CAM ? 'orange' : 'transparent') }} 
										onClick={() => {setPage(PAGE_SINGLE_CAM)}}><CameraIcon/></IconButton>
							<IconButton  key={PAGE_MULTI_CAM}
										sx={{ color:'white', backgroundColor: (selectedPage === PAGE_MULTI_CAM ? 'orange' : 'transparent') }} 
										onClick={() => {setPage(PAGE_MULTI_CAM)}}><AreaIcon/></IconButton>
						</Box>

						<Box sx={{ flexGrow: 0, display: { xs: 'none'}, marginRight: "10px" }}>
							<Tooltip title={auth ? auth["email"] : ""}><Typography variant="button">{auth ? auth["name"] : ""}</Typography></Tooltip>
						</Box>

						<Box sx={{ display: 'flex', flexGrow: 0, alignItems: 'center' }}>

							{ width >= wideBreak &&
								renderOthers(sessionInfo)
							}

							<IconButton sx={{ p: 0 }}>
								<Tooltip title={auth ? auth["name"] : ""}>
									<Avatar alt={auth ? auth["name"] : ""} src={auth ? auth["picture"] : ""} onClick={ () => { setOthersOpen(true) }}/>
								</Tooltip>
							</IconButton>

							<Box sx={{ display: 'flex', alignItems: 'center', marginRight: '5px', marginLeft: '10px'}}>
								<Typography variant="caption">{getRemainingTime(sessionInfo)}</Typography>
							</Box>


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
				<Box>
					{ !zoomableOpen &&
						<Box component="main" sx={{ flexGrow: 1, p: 1 }}>
							<Toolbar />
							{ width < wideBreak &&
								<Thumb id={selectedDevice} name={lookupDevice(selectedDevice)} width={width - 20 } interval="1500" clickCallback={handleSingleClick} timeoutCallback={handleThumbTimeout}></Thumb>
							}
							{ width >= wideBreak &&
								<Thumb id={selectedDevice} name={lookupDevice(selectedDevice)} width={width - drawerWidth - 20} interval="1500" clickCallback={handleSingleClick} timeoutCallback={handleThumbTimeout}></Thumb>
							}
						</Box>
					}
				</Box>
			}
			{selectedPage === PAGE_MULTI_CAM &&
				<Box component="main" sx={{ flexGrow: 1 }}>
					<Toolbar />
					{ !zoomableOpen &&
						<Grid container alignItems="left" justifyContent="left" rowSpacing="1px" columnSpacing="1px" sx={{ p: 1 }}>
							{
								Object.values(getSelectedAreaIds(selectedArea)).map((item) => (
									<Grid item sx={{ minWidth: 320, justifyContent: 'center' }}>
										{ width < 360 &&
											<Thumb id={item} name={lookupDevice(item)} width={width - 20} interval="3000" smallThumb clickCallback={handleMultiClick} timeoutCallback={handleThumbTimeout}></Thumb>
										}
										{ width >= 360 &&
											<Thumb id={item} name={lookupDevice(item)} width="340" interval="3000" smallThumb clickCallback={handleMultiClick} timeoutCallback={handleThumbTimeout}></Thumb>
										}
									</Grid>
								))
							}
						</Grid>
					}
				</Box>
			}

			{ width < wideBreak &&
				<Dialog fullScreen open={zoomableOpen} onClose={ () => setZoomableOpen(false) }>
					<DialogActions>
						<IconButton onClick={ () => setZoomableOpen(false) }><CloseIcon/></IconButton>
					</DialogActions>
					<DialogTitle>Zoom and Scroll</DialogTitle>
					<DialogContent>
						<Thumb id={selectedDevice} name={lookupDevice(selectedDevice)} width={1920} interval="0" timeoutCallback={handleThumbTimeout} zoomable ></Thumb>
					</DialogContent>
				</Dialog>
			}

			<Dialog maxWidth={width - 20} open={othersOpen} onClose={ () => setOthersOpen(false) }>
				<DialogActions>
					<IconButton onClick={ () => setOthersOpen(false) }><CloseIcon/></IconButton>
				</DialogActions>
				<DialogTitle>Other Viewers</DialogTitle>
				<DialogContent>
				 	{renderOthers(sessionInfo, true)}
				</DialogContent>
				</Dialog>			
		</Box>

	);
}



export default Home;
