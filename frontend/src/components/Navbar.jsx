import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo77.png";
import "./Navbar.css";

const Navbar = () => {

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        <img src={logo} alt="Healthcare Logo" className="logo" />
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/checkup">Diagnosis</Link>
        <Link to="/records">Records</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
