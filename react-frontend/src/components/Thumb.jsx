import React, { useEffect, useState, useRef, useCallback } from "react";
import { BACKEND_URL } from "./Constants";
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

function Thumb(props) {
    const [thumb, setThumb] = useState(null);
    const [reloading, setReloading] = useState(false);
    const [zoomMode, setZoomMode] = useState(false);
    
    var req = useRef(null);

    const imgRef = useRef();

	const onUpdate = useCallback(({ x, y, scale }) => {
	  const { current: img } = imgRef;
  
	  if (img) {
		const value = make3dTransformValue({ x, y, scale });
  
		img.style.setProperty("transform", value);
	  }
	}, []);

    const getThumb = (id) => {
        if (id) {
            let url="";
            if (props.imgHeight !== undefined) {
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&height=${props.imgHeight}`;
            } else if (props.imgWidth !== undefined) {
                let w = props.imgWidth;
                if (w > 1280) {
                    w = 1280;
                }
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&width=${w}`;
            }
            Axios.get(url, {
                responseType: 'blob',
                cancelToken: req.current.token,
                headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
            })
                .then((res) => {
                    setThumb(URL.createObjectURL(res.data));
                    setReloading(false);
                })
                .catch((err) => {
                    if (err.response && err.response.status === 429) {
                        props.handleTimeout();
                    } else {
                        //console.log(err);
                    }
                })
        }
    }

    useEffect(() => {
        let tid = -1;

        req.current = Axios.CancelToken.source();
        let reqCopy = req.current;

        setZoomMode(props.zoomable);

        if (thumb !== null) {
            clearInterval(tid);
            setReloading(true);
            getThumb(props.id);
        }

        if (props.zoomable) {
            getThumb(props.id);
        } else {
            tid = setInterval(() => {
                getThumb(props.id);
            }, props.interval);
        }
        return () => {
            reqCopy.cancel();
            clearInterval(tid);
        }
    }, [props.id, props.interval, props.imgWidth]);

    var now = new Date().toLocaleString();

    return (
        <Box>
            { thumb === null &&

                <Box sx={{ backgroundColor: '#eeeeee', width: props.imgWidth, height: (props.imgWidth*9/16), display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress disableShrink/>
                    { props.smallThumb !== true &&
                        <Typography variant="h6" sx={{marginLeft: '10px'}}>Loading...</Typography>
                    }
                </Box>

            }
            { (thumb !== null && zoomMode) &&
                <QuickPinchZoom onUpdate={onUpdate} minZoom={0.75} maxZoom={10}>
                    <img src={thumb} alt="" ref={imgRef}/>
                </QuickPinchZoom>
            }
            { (thumb !== null && !zoomMode) &&
                    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#aaaaaa', textAlign: 'center'}} >
                        <Button sx={{ p: 0, m: 0}} onClick={ (event) => props.onClick(event, props.id) }>
                            <img width={props.imgWidth} height={props.imgHeight} src={thumb} alt="" ref={imgRef}/>
                            { reloading &&
                                <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '100%', background: 'black', opacity: '50%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                    <CircularProgress disableShrink/>
                                </Box>

                            }
                            { props.smallThumb === true &&
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    
                                    textShadow: '1px 3px 3px black',
                                    backgroundColor: 'transparent',
                                    fontWeight: 'bolder',
                                    color: 'white',
                                    padding: '4px',
                                    margin: 0
                                }}>
                                    <Box sx={{ justifyContent:'right' }}>
                                        <div>{props.name} </div> 
                                    </Box>
                                </Box>
                            }
                            { props.smallThumb !== true &&
                                <Box width="100%" sx={{
                                    position: 'absolute',
                                    height: 32,
                                    bottom: -32,
                                    backgroundColor: 'transparent',
                                    fontWeight: 'bolder',
                                    color: 'black',
                                    padding: '4px',
                                    margin: 0
                                }}>
                                    <Box>
                                        <div>{props.name} {now}</div>
                                    </Box>
                                </Box>
                            }

                        </Button>
                    </Box>
                }
        </Box>
    );

}

export default Thumb;
