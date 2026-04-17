import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        
        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged in Successfully", "success");
            navigate("/");
        } else {
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div className="card p-4 shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "450px", background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)" }}>
                
                <div className="text-center mb-4">
                    <div className="display-6 mb-2">🔐</div>
                    <h2 className="fw-bold text-dark">Welcome Back</h2>
                    <p className="text-muted small">Login to access your secure iNotebook</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold small text-uppercase text-muted">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><i className="fa-solid fa-envelope text-primary"></i></span>
                            <input 
                                onChange={onChange} 
                                value={credentials.email} 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                name="email" 
                                placeholder="name@example.com"
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-semibold small text-uppercase text-muted">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><i className="fa-solid fa-lock text-primary"></i></span>
                            <input 
                                onChange={onChange} 
                                value={credentials.password} 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary py-2 fw-bold">
                            Sign In
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="small text-muted">
                            Don't have an account? <span className="text-primary cursor-pointer fw-bold" onClick={() => navigate('/signup')}>Create one</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;