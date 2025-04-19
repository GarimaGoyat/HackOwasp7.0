import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">Home</Link>
            </div>
            <div className="navbar-right">
                <Link to="/shop-owner" className="navbar-link">Shop Owner</Link>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/signup" className="navbar-link">Signup</Link>
            </div>
        </nav>
    );
};

export default Navbar;