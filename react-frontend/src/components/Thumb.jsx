import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../App";
import Axios from "axios";
import { useNavigate } from "react-router";
import Typography from '@mui/material/Typography';

import '@fontsource/roboto/300.css';

function Thumb({ id }) {
    const [setAuth] = useState(null);
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


    const divStyle = {
        position: 'relative',
        left: '0%',
        top: -35,
        opacity: '90%',
        paddingLeft: '5px',
        
    };
    var d = new Date();

    return (
        <div style={{ height: 480 }}>
            <img src={thumb} alt="" height="480"/>
            <div style={divStyle}>
                <Typography variant="h5" color="#ffffff">{d.toLocaleString()}</Typography>
            </div>
        </div>
    );

}

export default Thumb;
