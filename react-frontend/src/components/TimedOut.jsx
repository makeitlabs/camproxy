import React from "react";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
function TimedOut(props) {

    return (
        <Box>
            <Alert severity="warning">Your session timed out.</Alert>
            <Button onClick={(e)=>props.login(e)}>Log in again</Button>
        </Box>
    );
}

export default TimedOut;
