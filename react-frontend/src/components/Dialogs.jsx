import * as React from 'react';
import { IconButton, Button, Box, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SessionOthers, SessionOthersCount } from "./Session";
import { lookupDevice } from './Devices';
import AppLogoText from './AppLogoText';
import Thumb from "./Thumb";

const OthersDialog = (props) => {
    let session = props.session;
    return (
        <Dialog open={props.open} onClose={() => props.setOpen(false)}>
            <DialogActions>
                <IconButton onClick={() => props.setOpen(false)}><CloseIcon /></IconButton>
            </DialogActions>

            {SessionOthersCount(session) !== 0 &&
                <DialogTitle>Other Viewers</DialogTitle>
            }
            <DialogContent>
                <SessionOthers session={session} isList={true} />
            </DialogContent>

        </Dialog>
    );
}

const ZoomDialog = (props) => {
    let name = lookupDevice(props.id, props.devices)
    return (
        <Dialog sx={{ p: 0, m: 0 }} fullScreen open={props.open} onClose={() => props.setOpen(false)}>
            <DialogActions sx={{ p: 0, m: 0, background: 'orange' }}>
                <Box sx={{ ml: 1, mr: 1, alignItems: 'center', display: 'flex' }}><Typography variant="caption">{name}</Typography></Box>
                <IconButton onClick={() => props.setOpen(false)}><CloseIcon /></IconButton>
            </DialogActions>
            <DialogContent sx={{ p: 0, m: 0, border: '2px solid gray' }}>
                <Thumb id={props.id} name={name} imgWidth={1920} interval="0" zoomable ></Thumb>
            </DialogContent>
        </Dialog>
    );
}

const AboutDialog = (props) => {
    return (
        <Dialog open={props.open} onClose={() => props.setOpen(false)} >
            <DialogTitle>
                <Box sx={{ backgroundColor: '#eeeeee', p: 2, display: 'flex', justifyContent: 'center' }}>
                    <AppLogoText onClick={() => props.setOpen(false)} />
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="h8" sx={{ fontWeight: 900 }}>Copyright (c) 2016-2023 Stephen Richardson and MakeIt Labs</Typography>
                </DialogContentText>
                <Box sx={{ m: 2 }} />
                <DialogContentText>
                    The front-end that runs in your browser is written in Javascript using <a href="https://reactjs.org/">React</a>.
                    The backend that runs on the server side is written in Python with <a href="https://flask.palletsprojects.com">Flask</a>.
                </DialogContentText>
                <Box sx={{ m: 2 }} />
                <DialogContentText>
                    This software is open source.  See <a href="https://github.com/makeitlabs/camproxy">the GitHub project page</a>.
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)}>OK</Button>
            </DialogActions>

        </Dialog>
    );
}

export { OthersDialog, ZoomDialog, AboutDialog };
