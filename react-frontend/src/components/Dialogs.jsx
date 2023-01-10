import * as React from 'react';
import { IconButton } from '@mui/material';
import { Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SessionOthers, SessionOthersCount } from "./Session";
import { lookupDevice } from './Devices';
import Thumb from "./Thumb";

const OthersDialog = (props) => {
    let session = props.session;
    return (
        <Dialog maxWidth={props.width - 20} open={props.open} onClose={() => props.setOpen(false)}>
            <DialogActions>
                <IconButton onClick={() => props.setOpen(false) }><CloseIcon /></IconButton>
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
        <Dialog fullScreen open={props.open} onClose={() => props.setOpen(false)}>
            <DialogActions>
                <IconButton onClick={() => props.setOpen(false)}><CloseIcon /></IconButton>
            </DialogActions>
            <DialogTitle>Zoom and Scroll Snapshot Image</DialogTitle>
            <DialogContent>
                <Thumb id={props.id} name={name} imgWidth={1920} interval="0" zoomable ></Thumb>
            </DialogContent>
        </Dialog>
    );
}

export { OthersDialog, ZoomDialog };
