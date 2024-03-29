import { Grid, Box, Toolbar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PAGE_SINGLE_CAM, PAGE_MULTI_CAM, DRAWER_WIDTH } from './Constants';
import { lookupDevice, getSelectedAreaIds } from './Devices';
import Thumb from "./Thumb";


const MainViews = (props) => {
    let width = props.width;

    let devices = props.devices;
    let areas = props.areas;
    let selectedPage = props.selectedPage;
    let selectedDevice = props.selectedDevice;
    let selectedArea = props.selectedArea;

    let zoomableOpen = props.zoomableOpen;

    const staticDrawer = useMediaQuery('(min-width:900px)');

    if (selectedPage === PAGE_SINGLE_CAM)
        return (
            <Box>
                {!zoomableOpen &&
                    <Box component="main" sx={{ flexGrow: 0, p: '2px' }}>
                        <Toolbar />
                            <Thumb id={selectedDevice} name={lookupDevice(selectedDevice, devices)} imgWidth={ staticDrawer?  (width - DRAWER_WIDTH - 3) : (width - 3) } interval="1500" onClick={props.onSingleClick} {...props}></Thumb>
                    </Box>
                }
            </Box>
        );
    else if (selectedPage === PAGE_MULTI_CAM)
        return (
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Toolbar />
                {!zoomableOpen &&
                    <Grid container alignItems="left" justifyContent="left" rowSpacing="1px" columnSpacing="1px" sx={{ p: 1 }}>
                        {
                            Object.values(getSelectedAreaIds(selectedArea, areas)).map((item) => (
                                <Grid item key={item} sx={{ minWidth: 320, justifyContent: 'center' }}>
                                    {width < 360 &&
                                        <Thumb smallThumb id={item} name={lookupDevice(item, devices)} imgWidth={width - 3} interval="4000"  onClick={props.onMultiClick} {...props}></Thumb>
                                    }
                                    {width >= 360 &&
                                        <Thumb smallThumb id={item} name={lookupDevice(item, devices)} imgWidth={340} imgHeight={192} interval="4000" onClick={props.onMultiClick} {...props}></Thumb>
                                    }
                                </Grid>
                            ))
                        }
                    </Grid>
                }
            </Box>
        );
}

export default MainViews;
