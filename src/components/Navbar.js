import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    let navigate = useNavigate();
    let location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-4">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span>iNotebook</span><span className="brand-dot">.</span>
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem('token') ? (
                        <div className="d-flex gap-2">
                            <Link className="btn btn-light text-primary border-0" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary shadow-sm" to="/signup" role="button">Sign Up</Link>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar