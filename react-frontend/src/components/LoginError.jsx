import React from "react";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
function LoginError(props) {

    return (
        <Box>
            <Alert severity="info">Sorry, you must log in with your MakeIt gmail workspace account.  If you did this and still have trouble, try using a private browser window.</Alert>
            <Button onClick={(e)=>props.login(e)}>Log in again</Button>
        </Box>
    );
}

export default LoginError;
