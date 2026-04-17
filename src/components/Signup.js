import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        // Frontend Validation for Password Match
        if (password !== cpassword) {
            props.showAlert("Passwords do not match", "danger");
            return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json();
        
        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account Created Successfully", "success");
        } else {
            props.showAlert(json.error || "Invalid Details", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
            <div className="card p-4 shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "500px", background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)" }}>
                
                <div className="text-center mb-4">
                    <div className="display-6 mb-2">🚀</div>
                    <h2 className="fw-bold text-dark">Join iNotebook</h2>
                    <p className="text-muted small">Create an account to start organizing your thoughts</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold small text-uppercase text-muted">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><i className="fa-solid fa-user text-primary"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                name="name" 
                                onChange={onChange} 
                                placeholder="John Doe" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold small text-uppercase text-muted">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><i className="fa-solid fa-envelope text-primary"></i></span>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                name="email" 
                                onChange={onChange} 
                                placeholder="name@example.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label fw-semibold small text-uppercase text-muted">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                name="password" 
                                onChange={onChange} 
                                placeholder="••••••••" 
                                minLength={5} 
                                required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="cpassword" className="form-label fw-semibold small text-uppercase text-muted">Confirm</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="cpassword" 
                                name="cpassword" 
                                onChange={onChange} 
                                placeholder="••••••••" 
                                minLength={5} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-2">
                        <button type="submit" className="btn btn-primary py-2 fw-bold">
                            Create Account
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="small text-muted">
                            Already have an account? <span className="text-primary cursor-pointer fw-bold" onClick={() => navigate('/login')}>Login</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;