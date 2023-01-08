import React, { useEffect } from "react"
import { useNavigate } from "react-router";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import '@fontsource/roboto/300.css';

function Login(props) {

    const nav=useNavigate();

    useEffect(()=>{
	if(localStorage.getItem('JWT')!== null){
	    return nav("/home")
	}
    },[nav])
    return (
		<Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh'}}>
		<Card sx={{ maxWidth: 345 }}>
		<CardMedia
		  sx={{ width: 250, margin: "10px"}}
		  component="img"
		  alt="MakeIt Labs"
		  image="/logo-2016-01.png"
		/>
		<CardContent>
		  <Typography variant="body2" color="text.secondary">
			Please log in with your MakeIt Labs Google Workspace account.
		  </Typography>
		</CardContent>
		<CardActions>
		  <Button size="small" onClick={(e)=>props.login(e)}>Login</Button>
		</CardActions>
	  </Card>
	  </Grid>
    );
}

export default Login;
