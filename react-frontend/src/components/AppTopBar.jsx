import { AppBar, Box, Toolbar, IconButton, Tooltip } from '@mui/material';
import AppLogoText from './AppLogoText';
import CameraIcon from '@mui/icons-material/CropOriginalSharp';
import AreaIcon from '@mui/icons-material/GridOnSharp';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { SessionAppBar } from "./Session";

import { DEVEL, PAGE_SINGLE_CAM, PAGE_MULTI_CAM, DRAWER_WIDTH } from './Constants';


const AppTopBar = (props) => {
    let width = props.width;
    let selectedPage = props.selectedPage;
    let setPage = props.setPage;
    let auth = props.auth;
    let session = props.session;

    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    backgroundColor: `${DEVEL}` === "yes" ? 'gray' : '#1976d2'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={props.onDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <AppLogoText />

                    <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                        <Tooltip title="Single camera view">
                            <IconButton key={PAGE_SINGLE_CAM}
                                sx={{ color: 'white', backgroundColor: (selectedPage === PAGE_SINGLE_CAM ? 'orange' : 'transparent') }}
                                onClick={() => { setPage(PAGE_SINGLE_CAM) }}><CameraIcon /></IconButton>
                        </Tooltip>

                        <Tooltip title="Multi-camera view">
                            <IconButton key={PAGE_MULTI_CAM}
                                sx={{ color: 'white', backgroundColor: (selectedPage === PAGE_MULTI_CAM ? 'orange' : 'transparent') }}
                                onClick={() => { setPage(PAGE_MULTI_CAM) }}><AreaIcon /></IconButton>
                        </Tooltip>
                    </Box>

                    <SessionAppBar session={session} auth={auth} width={width} setOthersOpen={() => { props.setOthersOpen(true) }} />

                    <Tooltip title="Logout">
                        <IconButton onClick={() => props.handleLogout()} color="inherit">
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>


                </Toolbar>

            </AppBar>
        </Box>
    );

}

export default AppTopBar;
