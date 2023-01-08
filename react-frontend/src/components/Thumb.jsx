import React, { useEffect, useState, useRef } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function Thumb({ id, name, height, width, interval, smallThumb, clickCallback }) {
    const [thumb, setThumb] = useState(null);
    const [timerId, setTimerId] = useState(null);
    const [reloading, setReloading] = useState(false);
    var req = useRef(null);

    

    const getThumb = (id) => {

        if (id) {
            let url="";
            if (height !== undefined) {
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&height=${height}`;
            } else if (width !== undefined) {
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&width=${width}`;
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
                    console.log(err);
                    //setThumb(null);
                })
        }
    }

    useEffect(() => {
        req.current = Axios.CancelToken.source();
        let reqCopy = req.current;

        if (timerId !== null) {
            clearInterval(timerId);
            //setThumb(null);
            setReloading(true);
            getThumb(id);
        }

        const tid = setInterval(() => {
            getThumb(id);
        }, interval);
        setTimerId(tid);
        return () => {
            reqCopy.cancel();
            clearInterval(timerId);
        }
    }, [id, interval]);

    var now = new Date().toLocaleString();

    return (
        <Box>
            { thumb === null &&

                <Box sx={{ backgroundColor: '#eeeeee', width: width, height: (width*9/16), display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress disableShrink/>
                    { smallThumb !== true &&
                        <Typography variant="h6" sx={{marginLeft: '10px'}}>Loading...</Typography>
                    }
                </Box>

            }
            { thumb !== null &&
                <Box sx={{ width: '100%', height: '100%', backgroundColor: '#aaaaaa', textAlign: 'center'}} >
                    <Button sx={{ p: 0, m: 0}} onClick={ (event) => { if (clickCallback !== undefined) { clickCallback(event, id) }} }>
                        <img src={thumb} alt="" />
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
                                bottom: 0,
                                textShadow: '1px 3px 3px black',
                                backgroundColor: 'black',
                                fontWeight: 'bolder',
                                color: 'white',
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
