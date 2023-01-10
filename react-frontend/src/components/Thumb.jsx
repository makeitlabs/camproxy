import React, { useEffect, useState, useRef, useCallback } from "react";
import { BACKEND_URL } from "./Constants";
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

function Thumb({zoomable, smallThumb, id, name, imgWidth, imgHeight, interval, handleTimeout, onClick}) {
    const [thumb, setThumb] = useState(null);
    const [reloading, setReloading] = useState(false);
    const [zoomMode, setZoomMode] = useState(false);
    
    var req = useRef(null);
    const imgRef = useRef();
    const thumbLoadedRef = useRef(null);
    const tidRef = useRef(null);

	const onUpdate = useCallback(({ x, y, scale }) => {
	  const { current: img } = imgRef;
  
	  if (img) {
		const value = make3dTransformValue({ x, y, scale });
  
		img.style.setProperty("transform", value);
	  }
	}, []);

    useEffect(() => {
        const fetchThumb = (id) => {
            if (id) {
                let url="";
                if (imgHeight !== undefined) {
                    url=`${BACKEND_URL}/thumbnail?camera_id=${id}&height=${imgHeight}`;
                } else if (imgWidth !== undefined) {
                    let w = imgWidth;
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
                        thumbLoadedRef.current = true;
                        setReloading(false);
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 429) {
                            handleTimeout();
                        } else {
                            //console.log(err);
                        }
                    })
            }
        }

        req.current = Axios.CancelToken.source();
        let reqCopy = req.current;

        setZoomMode(zoomable);

        if (thumbLoadedRef.current !== null) {
            clearInterval(tidRef.current);
            setReloading(true);
            fetchThumb(id);
        } else {
            setTimeout( () => fetchThumb(id), 100 );
        }

        let oi = Number(interval);
        let randomized_interval = Math.floor(oi + (Math.random() * oi/10) - oi/20);

        tidRef.current = setInterval(() => {
            fetchThumb(id);
        }, randomized_interval);
        return () => {
            reqCopy.cancel();
            clearInterval(tidRef.current);
        }
    }, [id, interval, imgWidth, imgHeight, zoomable, handleTimeout]);

    var now = new Date().toLocaleString();

    return (
        <Box>
            { thumb === null &&

                <Box sx={{ backgroundColor: '#eeeeee', width: imgWidth, height: (imgWidth*9/16), display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress disableShrink/>
                    { smallThumb !== true &&
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
                        <Button sx={{ p: 0, m: 0}} onClick={ (event) => onClick(event, id) }>
                            <img width={imgWidth} height={imgHeight} src={thumb} alt="" ref={imgRef}/>
                            { reloading &&
                                <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '100%', background: 'black', opacity: '50%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                    <CircularProgress disableShrink/>
                                </Box>

                            }
                            { smallThumb === true &&
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
                                        <div>{name} </div> 
                                    </Box>
                                </Box>
                            }
                            { smallThumb !== true &&
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
                                        <div>{name} {now}</div>
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
