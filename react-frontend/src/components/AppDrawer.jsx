import * as React from 'react';
import { Box, Typography, Drawer, CircularProgress } from '@mui/material';
import { PAGE_SINGLE_CAM, PAGE_MULTI_CAM, DRAWER_WIDTH } from './Constants';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { lookupDevice } from './Devices';
import CameraIcon from '@mui/icons-material/CropOriginalSharp';
import AreaIcon from '@mui/icons-material/GridOnSharp';


const DrawerContents = (props) => {
    let selectedPage = props.selectedPage;
    let selectedDevice = props.selectedDevice;
    let areas = props.areas;
    let devices = props.devices;
    let selectedArea = props.selectedArea;

    return (
        <div>
            {selectedPage === PAGE_SINGLE_CAM &&
                <Box>
                    <Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Cameras</Typography>
                    {Object.keys(areas).length > 0 &&
                        <List dense>
                            {
                                Object.keys(areas).map((item) => (
                                    <List dense key={item}>
                                        <ListSubheader key={item} sx={{ color: 'green', fontWeight: 'bold', backgroundColor: '#eeeeee' }}>
                                            <ListItemButton key={item + "_1"} onClick={(event) => props.onAreaClick(event, item) } >
                                                <Box sx={{ display: 'flex', p: 0, alignItems: 'center' }}>
                                                    <AreaIcon sx={{ mr: 1 }} />
                                                    {item}
                                                </Box>
                                            </ListItemButton>
                                        </ListSubheader>
                                        {areas[item].map((dev) => (
                                            <ListItem key={dev} disablePadding selected={selectedDevice === dev}>
                                                <ListItemButton key={dev + "_1"} onClick={(event) => props.onDeviceClick(event, dev)} >
                                                    <ListItemIcon key={dev + "_2"} sx={{ minWidth: '12px', paddingRight: '2px', opacity: '50%' }}><CameraIcon /></ListItemIcon>
                                                    <ListItemText key={dev + "_3"} primary={lookupDevice(dev, devices).split(' - ')[1]} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ))

                            }

                        </List>
                    }
                    {Object.keys(areas).length === 0 &&
                        <Box sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                            <CircularProgress disableShrink />
                        </Box>
                    }
                </Box>
            }

            {selectedPage === PAGE_MULTI_CAM &&
                <Box>
                    <Typography variant="button" sx={{ marginLeft: 2, fontWeight: 'bold', color: 'blue' }}>Available Areas</Typography>
                    {Object.keys(areas).length > 0 &&
                        <List>
                            {
                                Object.keys(areas).map((item) => (
                                    <ListItem key={item} disablePadding selected={selectedArea === item}>
                                        <ListItemButton onClick={(event) => props.onAreaClick(event, item)} >
                                            <ListItemIcon><AreaIcon /></ListItemIcon>
                                            <ListItemText primary={item} secondary={areas[item].length + " cameras"} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }

                        </List>
                    }
                    {Object.keys(areas).length === 0 &&
                        <Box sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                            <CircularProgress disableShrink />
                        </Box>
                    }
                </Box>
            }
        </div>
    );
}

const AppDrawer = (props) => {
    return (
        <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="temporary"
                open={props.open}
                onClose={props.onDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                }}
            >
                <DrawerContents {...props} />
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                }}
                open
            >
                <DrawerContents {...props} />
            </Drawer>
        </Box>
    );
}

export default AppDrawer;