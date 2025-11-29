import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
    const navigate = useNavigate();
    const { register, users, loggedInUser } = useAppContext();
    const [formData, setFormData] = useState({
        regUsername: '',
        regEmail: '',
        regCollege: '',
        regBranch: '',
        regPassword: '',
        regConfirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    // Redirect if already logged in
    useEffect(() => {
        if (loggedInUser) {
            navigate(loggedInUser.isAdmin ? '/admin' : '/dashboard');
        }
    }, [loggedInUser, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const registerUser = async (e) => {
        e.preventDefault();
        
        const { regUsername, regEmail, regCollege, regBranch, regPassword, regConfirmPassword } = formData;
        const username = regUsername.trim();
        const email = regEmail.trim().toLowerCase();
        const college = regCollege.trim();
        const branch = regBranch.trim();
        
        // Validation
        if (!username || !email || !college || !branch || !regPassword) {
            setMessage({ text: 'All fields are required', type: 'error' });
            return;
        }
        
        if (regPassword.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }
        
        if (regPassword !== regConfirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }
        
        // Check if username is 'admin' (reserved)
        if (username.toLowerCase() === 'admin') {
            setMessage({ text: 'Username "admin" is reserved. Please choose another.', type: 'error' });
            return;
        }
        
        // Create new user
        const newUser = {
            username,
            email,
            fullName: username, // MongoDB User model requires fullName
            password: regPassword
        };
        
        const result = await register(newUser);
        
        if (result.success) {
            setMessage({ text: 'Account created successfully! Redirecting to login...', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setMessage({ text: result.error || 'Registration failed', type: 'error' });
        }
    };

    return (
        <div className="auth-page">
            <Navbar />

            <section className="auth-section">
                <div className="auth-container">
                    {/* Info Panel */}
                    <div className="auth-info">
                        <h2>Start Your Journey to Success</h2>
                        <ul className="benefits-list">
                            <li><span className="benefit-icon icon-target"></span> Access 500+ curated internship opportunities</li>
                            <li><span className="benefit-icon icon-building"></span> Connect with top companies worldwide</li>
                            <li><span className="benefit-icon icon-chart-bar"></span> Track applications in real-time</li>
                            <li><span className="benefit-icon icon-document"></span> Build a professional profile</li>
                            <li><span className="benefit-icon icon-bell"></span> Get personalized recommendations</li>
                        </ul>
                        
                        <div className="demo-accounts">
                            <p>Join thousands of students already on InternHub</p>
                            <div className="auth-trust-badges">
                                <span className="trust-badge"><span className="badge-icon icon-lock"></span> Secure</span>
                                <span className="trust-badge"><span className="badge-icon icon-verified"></span> Verified Companies</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Registration Form */}
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>Join InternHub today and find your dream internship</p>
                        </div>

                        <div id="messageContainer">
                            {message.text && (
                                <div className={`inline-message inline-${message.type}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>

                        <form id="registerForm" className="auth-form" onSubmit={registerUser}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="regUsername">Username</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon icon-person"></span>
                                        <input 
                                            type="text" 
                                            id="regUsername" 
                                            name="regUsername"
                                            placeholder="Choose a username"
                                            value={formData.regUsername}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="regEmail">Email</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon input-icon-email"></span>
                                        <input 
                                            type="email" 
                                            id="regEmail" 
                                            name="regEmail"
                                            placeholder="your@email.com"
                                            value={formData.regEmail}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="regCollege">College/University</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon input-icon-college"></span>
                                        <input 
                                            type="text" 
                                            id="regCollege" 
                                            name="regCollege"
                                            placeholder="Your institution"
                                            value={formData.regCollege}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="regBranch">Branch/Major</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon input-icon-book"></span>
                                        <input 
                                            type="text" 
                                            id="regBranch" 
                                            name="regBranch"
                                            placeholder="e.g. Computer Science"
                                            value={formData.regBranch}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="regPassword">Password</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">🔒</span>
                                        <input 
                                            type="password" 
                                            id="regPassword" 
                                            name="regPassword"
                                            placeholder="Min 6 characters"
                                            value={formData.regPassword}
                                            onChange={handleChange}
                                            required 
                                            minLength="6" 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="regConfirmPassword">Confirm Password</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">🔐</span>
                                        <input 
                                            type="password" 
                                            id="regConfirmPassword" 
                                            name="regConfirmPassword"
                                            placeholder="Confirm your password"
                                            value={formData.regConfirmPassword}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-login btn-full">
                                Create My Account
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                            <p><Link to="/">← Back to Home</Link></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;
