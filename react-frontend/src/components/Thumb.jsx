import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function Thumb({ id, name, height, width, interval, hideTime, clickCallback, user }) {
    const [auth, setAuth] = useState(null);
    const [thumb, setThumb] = useState(null);
    const nav = useNavigate()

    const getThumb = (id) => {
        if (id !== null && id !== "" && id !== undefined) {
            let u = user;
            if (u === undefined || u === null || u === "") {
                u = "unknown";
            }
            
            let url="";
            if (height !== undefined) {
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&height=${height}&user=${u}`;
            } else if (width !== undefined) {
                url=`${BACKEND_URL}/thumbnail?camera_id=${id}&width=${width}&user=${u}`;
            }
            Axios.get(url, {
                responseType: 'blob',
                headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
            })
                .then((res) => {
                    setThumb(URL.createObjectURL(res.data));
                })
                .catch((err) => console.log(err));
        }
    }

    useEffect(() => {
        getThumb(id);

        const timer = setInterval(() => {
            getThumb(id);
        }, interval);
        return () => clearInterval(timer);
    }, [nav, id, setAuth]);

    var now = new Date().toLocaleString();

    return (
        <Box>
            { thumb === null &&

                <Box sx={{ backgroundColor: '#eeeeee', width: width, height: (width*9/16), display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress disableShrink>Image loading...</CircularProgress>
                    <Typography variant="h6" sx={{marginLeft: '10px'}}>Loading...</Typography>
                </Box>

            }
            { thumb !== null &&
                <Box sx={{ width: '100%', height: '100%', backgroundColor: '#aaaaaa', textAlign: 'center'}} >
                    <Button sx={{ p: 0, m: 0}} onClick={ (event) => { if (clickCallback !== undefined) { clickCallback(event, id) }} }>
                        <img src={thumb} alt="" />
                    { hideTime === true &&
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
                    { hideTime !== true &&
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
