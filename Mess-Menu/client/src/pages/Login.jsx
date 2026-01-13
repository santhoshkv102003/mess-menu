import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.email, formData.password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert('Login Failed');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Smart Mess Login</h2>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn-primary">Login</button>
                <Link to="/register" className="auth-link">Register as Student</Link>
            </form>
        </div>
    );
};

export default Login;
