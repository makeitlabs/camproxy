import React, { useEffect } from "react";
import Login from "./components/Login";
import LoginError from "./components/LoginError";
import Home from "./components/Home";
import Axios from "axios";
import { Routes, Route, useNavigate } from "react-router";
import '@fontsource/public-sans';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function App() {
  const nav = useNavigate()
  const handleClick = (e) => {
    e.preventDefault();
    Axios.get(`${BACKEND_URL}/auth/google`, {
      headers: {
        "Access-Control-Allow-Origin": "* ",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
      .then((res) => {
        window.location.assign(res.data.auth_url);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (localStorage.getItem('JWT') == null) {
      const query = new URLSearchParams(window.location.search);
      const token = query.get('jwt')
      if (token) {
        localStorage.setItem('JWT', token);
        return nav('/home')
      }
    }
  }, [nav])

  return (
    <Routes>
      <Route path="/login" element={<Login login={handleClick}></Login>} />
      <Route path="/login_error" element={<LoginError></LoginError>} />
      <Route path="/home" element={<Home/>} />

      <Route path="*" element={<Login login={handleClick}></Login>} />
    </Routes>
  );
}

export default App;
