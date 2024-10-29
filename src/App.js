import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/auth/login";
import SignUp from "./components/auth/register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/auth/profile";
import { useState } from "react";
import { auth } from "./components/firebase";
import Home from "./app/home";
import Contribute from "./app/contribute";
import RescueRequestList from "./app/request"
import InfoRequest from "./app/inforequest"

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/request" element={<RescueRequestList/>} />
          <Route path="/inforequest" element={<InfoRequest/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
