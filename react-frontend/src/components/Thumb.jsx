import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


function Thumb({ id, name }) {
    const [auth, setAuth] = useState(null);
    const [thumb, setThumb] = useState(null);
    const nav = useNavigate()

    const getThumb = (id) => {
        if (id !== null && id !== "" && id !== undefined) {
            Axios.get(`${BACKEND_URL}/thumbnail?camera_id=${id}&height=480`, {
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
        if (localStorage.getItem('JWT') == null) {
            return nav("/login")
        }
        else {
            Axios.get(`${BACKEND_URL}/home`, { headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` } })
                .then((res) => { setAuth(res) })
                .catch((err) => console.log(err));
        }
        const timer = setInterval(() => {
            getThumb(id);
        }, 1000);
        return () => clearInterval(timer);
    }, [nav, id, setAuth]);

    var now = new Date().toLocaleString();

    return (
        <Box>
            <img src={thumb} alt=""/>
            <Box sx={{
                position: 'relative',
                bottom: 40,
                left: 0,
                width: '100%',
                marginLeft: 2,
                textShadow: '1px 3px 3px black'
            }}>
                <Typography variant="h8" color="white">{name}</Typography>

                <Box sx={{
                    position: 'relative',
                    bottom: 460,
                    right: 0,
                    width: '100%',
                    textShadow: '1px 2px 2px black'
                }}>
                    <Typography variant="h8" color="white">{now}</Typography>
                </Box>

            </Box>
        </Box>
    );

}

export default Thumb;
