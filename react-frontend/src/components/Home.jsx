import * as React from 'react';
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router";
import { CssBaseline, Box } from '@mui/material';
import AppTopBar from "./AppTopBar";
import AppDrawer from "./AppDrawer";
import MainViews from "./MainViews";
import { OthersDialog, ZoomDialog, AboutDialog } from "./Dialogs";
import { useSession, Session } from "./Session";
import { useDevices, useAreas, Devices, findAreaForDevice } from "./Devices";
import { BACKEND_URL, PAGE_SINGLE_CAM, PAGE_MULTI_CAM, WIDE_BREAK } from './Constants';
import { getLocalItem } from './Helpers';
import '@fontsource/roboto/300.css';


function Home(props) {
	const [zoomableOpen, setZoomableOpen] = useState(false);
	const [othersOpen, setOthersOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

	const [auth, setAuth] = useState(null);
	const [session, setSession] = useSession({});

	const [devices, setDevices] = useDevices({});
	const [areas, setAreas] = useAreas({});

	const [selectedDevice, setSelectedDevice] = useState(null);
	const [selectedArea, setSelectedArea] = useState(null);
	const [selectedPage, setSelectedPage] = useState(PAGE_SINGLE_CAM);

	const nav = useNavigate()

	const setPage = (page) => {
		setSelectedPage(page);
		localStorage.setItem("selectedPage", page);
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

		let selPage = getLocalItem("selectedPage", PAGE_SINGLE_CAM);
		setSelectedPage(selPage);
	}, [nav, setDevices])



	const handleDeviceClick = (event, id) => {
		setSelectedDevice(id);
		localStorage.setItem("selectedDevice", id);
		setMobileDrawerOpen(false);
	}

	const handleAreaClick = (event, area) => {
		setSelectedArea(area);
		localStorage.setItem("selectedArea", area);
		setMobileDrawerOpen(false);
	}

	const handleMultiClick = (event, id) => {
		setSelectedDevice(id);
		if (props.width < WIDE_BREAK) {
			// on mobile, open up the zoomable snapshot window
			setZoomableOpen(true);
		} else {
			// otherwise, jump to single view of this camera
			localStorage.setItem("selectedDevice", id);
			setPage(PAGE_SINGLE_CAM);
		}
	}

	const handleSingleClick = (event, id) => {
		if (props.width < WIDE_BREAK) {
			// on mobile, open up the zoomable snapshot window
			setZoomableOpen(true);
		} else {
			// otherwise, find the area that contains this camera and show that multi-view
			let area = findAreaForDevice(id, areas);
			if (area) {
				setSelectedArea(area);
				localStorage.setItem("selectedArea", area);
				setPage(PAGE_MULTI_CAM);
			}
		}
	}

	return (
		<Box sx={{ display: 'flex' }} >
			<CssBaseline />
			<Session session={session} setSession={setSession} auth={auth} />
			<Devices setDevices={setDevices} setAreas={setAreas} setSelectedDevice={setSelectedDevice} setSelectedArea={setSelectedArea} {...props} />

			<AppTopBar onDrawerToggle={() => setMobileDrawerOpen(true)}
				selectedPage={selectedPage} setPage={setPage} setOthersOpen={setOthersOpen} onLogoClick={setAboutOpen}
				session={session} auth={auth} {...props} />

			<AppDrawer open={mobileDrawerOpen} onDrawerToggle={() => setMobileDrawerOpen(false)}
				onDeviceClick={handleDeviceClick} onAreaClick={handleAreaClick}
				devices={devices} areas={areas} selectedPage={selectedPage} selectedDevice={selectedDevice} selectedArea={selectedArea} {...props} />

			<MainViews zoomableOpen={zoomableOpen}
				devices={devices} areas={areas} selectedPage={selectedPage} selectedDevice={selectedDevice} selectedArea={selectedArea}
				onSingleClick={handleSingleClick} onMultiClick={handleMultiClick} {...props} />

			<ZoomDialog id={selectedDevice} devices={devices} open={zoomableOpen} setOpen={setZoomableOpen} {...props} />
			<OthersDialog session={session} open={othersOpen} setOpen={setOthersOpen} {...props} />
			<AboutDialog open={aboutOpen} setOpen={setAboutOpen} {...props} />
		</Box>

	);
}

export default Home;
