import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Avatar, Badge, Tooltip } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { BACKEND_URL, WIDE_BREAK } from "./Constants";
import Axios from "axios";

function useSession() {
    const [session, setSession] = useState({});

    return [session, setSession];
}


const Session = (props) => {
    let setSession = props.setSession;

    const fetchSessionInfo = () => {
        Axios.get(`${BACKEND_URL}/session_info`, {
            headers: { "authorization": `Bearer ${localStorage.getItem('JWT')}` }
        })
            .then((res) => {
                console.log("got session info", res.data);
                setSession(res.data);
            })
            .catch((err) => {

                if (err.response && err.response.status === 429) {
                    props.handleTimeout();
                } else {
                    console.log(err);
                }
            })
    }

    useEffect(() => {
        let tid = -1;

            fetchSessionInfo();
            
        tid = setInterval(() => {
            fetchSessionInfo();
        }, 10000);
        return () => {
            clearInterval(tid);
        }

    }, [])

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
                    <ListItem>
                        <Avatar sx={{ opacity: session.others[osub].session_age > 15 ? '30%' : '100%' }} src={session.others[osub].session_picture} />
                        <ListItemText sx={{ ml: 1 }}
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
                                return (<Tooltip title={session.others[osub].session_age > 15 ? session.others[osub].session_name + " (active recently)" : "Also viewing: " + session.others[osub].session_name}>
                                    <Avatar sx={{ height: 28, width: 28, ml: '2px', opacity: session.others[osub].session_age > 15 ? '60%' : '100%' }} src={session.others[osub].session_picture} />
                                </Tooltip>)
                        })
                    }
                </Box>
            );
        }
    }
    return <div />
}


const SessionAppBar = (props) => {
    let session = props.session;

    return (
        <Box sx={{ display: 'flex', flexGrow: 0, alignItems: 'center' }}>

            <Box sx={{ flexGrow: 0, display: { xs: 'none' }, marginRight: "10px" }}>
                <Tooltip title={props.auth ? props.auth["email"] : ""}><Typography variant="button">{props.auth ? props.auth["name"] : ""}</Typography></Tooltip>
            </Box>

            {props.width >= WIDE_BREAK &&
                <SessionOthers session={session} />
            }

            <IconButton sx={{ p: 0 }}>
                {props.width < WIDE_BREAK &&
                    <Tooltip title={props.auth ? props.auth["name"] + " (you), and others." : "(you), and others."}>
                        <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            overlap="circular"
                            invisible={SessionOthersCount(session) === 0}
                            badgeContent={SessionOthersCount(session)}
                            color="secondary">
                            <Avatar alt={props.auth ? props.auth["name"] + " (you)" : "(you)"} src={props.auth ? props.auth["picture"] : ""} onClick={() => { props.setOthersOpen(true) }} />
                        </Badge>
                    </Tooltip>
                }
                {props.width >= WIDE_BREAK &&
                    <Tooltip title={props.auth ? props.auth["name"] + " (you)" : "(you)"}>
                        <Avatar alt={props.auth ? props.auth["name"] + " (you)" : "(you)"} src={props.auth ? props.auth["picture"] : ""} onClick={() => { props.setOthersOpen(true) }} />
                    </Tooltip>
                }
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '5px', marginLeft: '10px', userSelect: 'none' }}>
                <Tooltip title="Session time remaining">
                    <Typography variant="caption">{RemainingTime(session)}</Typography>
                </Tooltip>
            </Box>

        </Box>
    );
}


export { useSession, Session, SessionAppBar, SessionOthers, SessionOthersCount };

