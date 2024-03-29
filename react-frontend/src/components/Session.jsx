import React, { useState, useEffect, useRef } from "react";
import { Box, Avatar, Tooltip } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { BACKEND_URL } from "./Constants";
import Axios from "axios";

function useSession() {
    const [session, setSession] = useState({});

    return [session, setSession];
}

const Session = ({ setSession, handleTimeout }) => {
    const tidRef = useRef(null);

    useEffect(() => {
        const fetchSessionInfo = () => {
            Axios.get(`${BACKEND_URL}/session_info`, {
                headers: { "authorization": `Bearer ${localStorage.getItem('JWT')}` }
            })
                .then((res) => {
                    setSession(res.data);
                })
                .catch((err) => {

                    if (err.response && err.response.status === 429) {
                        handleTimeout();
                    } else {
                        console.log(err);
                    }
                })
        }

        fetchSessionInfo();

        tidRef.current = setInterval(() => {
            fetchSessionInfo();
        }, 10000);
        return () => {
            clearInterval(tidRef.current);
        }

    }, [setSession, handleTimeout])

    return (<div />);

}

const RemainingTime = (session) => {
    if (session !== undefined && session.remaining_time !== undefined) {
        let secs = session.remaining_time;
        if (secs > 3600) {
            let hours = Math.floor(secs / 3600);
            return hours + 'h';
        } else if (secs > 60) {
            let mins = Math.floor(secs / 60);
            return mins + 'm';
        } else {
            return secs + 's';
        }
    }
    return "";
}

const SessionOthersCount = (session) => {
    if (session !== undefined && session.others !== undefined) {
        return Object.keys(session.others).length;
    }
    return 0;
}

const SessionOthers = (props) => {
    let session = props.session;

    if (session !== undefined && session.others !== undefined) {
        let otherCount = Object.keys(session.others).length;

        if (props.isList !== undefined) {
            if (otherCount === 0) {
                return (<Box>No other viewers.</Box>);
            } else {
                const others = Object.keys(session.others).map((osub) =>
                    <ListItem key={osub}>
                        <Avatar key={osub + "_1"} sx={{ backgroundColor: 'white', opacity: session.others[osub].session_age > 15 ? '30%' : '100%' }} src={session.others[osub].session_picture} />
                        <ListItemText key={osub + "_2"} sx={{ ml: 1 }}
                            primary={session.others[osub].session_name}
                            secondary={session.others[osub].session_age > 15 ? "active recently" : "active now"} />
                    </ListItem>
                );
                return (<List>{others}</List>);
            }
        } else {
            return (
                <Box sx={{ mr: 2, display: 'flex' }}>
                    {
                        Object.keys(session.others).map((osub) => {
                            if (session.others[osub].session_age < 60)
                                return (
                                    <Tooltip key={osub} title={session.others[osub].session_age > 15 ? session.others[osub].session_name + " (active recently)" : "Also viewing: " + session.others[osub].session_name}>
                                        <Avatar key={osub + "_1"} sx={{ backgroundColor: 'white', height: 28, width: 28, ml: '2px', opacity: session.others[osub].session_age > 15 ? '60%' : '100%' }} src={session.others[osub].session_picture} />
                                    </Tooltip>)
                            else
                                return null;
                        })
                    }
                </Box>
            );
        }
    }
    return <div />
}



export { useSession, Session, SessionOthers, SessionOthersCount, RemainingTime };

