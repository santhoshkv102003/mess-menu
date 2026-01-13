import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            if (formData.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (error) {
            alert('Registration Failed');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
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
                <div className="form-group">
                    <select
                        className="form-input"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary">Register</button>
                <Link to="/login" className="auth-link">Already have an account? Login</Link>
            </form>
        </div>
    );
};

export default Register;
