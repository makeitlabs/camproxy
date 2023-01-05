import React from "react";
import { useNavigate } from "react-router";

function LoginError() {

    const nav=useNavigate()
    
    const handleLogout=()=>{
	return nav("/login")
    }
    return (
	<div style={{padding:"10px", border:"2px solid black", margin:"20px"}}>
	    <h1>Login error, you must use the correct gmail account.</h1>
	    <button onClick={()=>handleLogout()}>Try Again</button>
	</div>
    );
}

export default LoginError;
