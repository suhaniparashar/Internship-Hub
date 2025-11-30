import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
    const navigate = useNavigate();
    const { register, loggedInUser } = useAppContext();
    const [formData, setFormData] = useState({
        regUsername: '',
        regEmail: '',
        regCollege: '',
        regBranch: '',
        regPassword: '',
        regConfirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Redirect if already logged in
    useEffect(() => {
        if (loggedInUser) {
            navigate(loggedInUser.isAdmin ? '/admin' : '/dashboard');
        }
    }, [loggedInUser, navigate]);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Update password strength
        if (name === 'regPassword') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const { regUsername, regEmail, regCollege, regBranch, regPassword, regConfirmPassword } = formData;
        
        const username = regUsername.trim();
        const email = regEmail.trim().toLowerCase();
        const college = regCollege.trim();
        const branch = regBranch.trim();

        // Check empty fields
        if (!username || !email || !college || !branch || !regPassword) {
            setMessage({ text: '❌ All fields are required', type: 'error' });
            return false;
        }

        // Username validation
        if (username.length < 3) {
            setMessage({ text: '❌ Username must be at least 3 characters long', type: 'error' });
            return false;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setMessage({ text: '❌ Username can only contain letters, numbers, underscore, and hyphen', type: 'error' });
            return false;
        }

        // Email validation
        if (!validateEmail(email)) {
            setMessage({ text: '❌ Please enter a valid email address', type: 'error' });
            return false;
        }

        // Check if username is 'admin' (reserved)
        if (username.toLowerCase() === 'admin') {
            setMessage({ text: '❌ Username "admin" is reserved. Please choose another.', type: 'error' });
            return false;
        }

        // Password validation
        if (regPassword.length < 6) {
            setMessage({ text: '❌ Password must be at least 6 characters', type: 'error' });
            return false;
        }

        if (regPassword !== regConfirmPassword) {
            setMessage({ text: '❌ Passwords do not match', type: 'error' });
            return false;
        }

        // Check for existing users in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            setMessage({ text: '❌ Username already taken', type: 'error' });
            return false;
        }

        if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setMessage({ text: '❌ Email already registered', type: 'error' });
            return false;
        }

        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const { regUsername, regEmail, regCollege, regBranch, regPassword } = formData;
        const username = regUsername.trim();
        const email = regEmail.trim().toLowerCase();
        const college = regCollege.trim();
        const branch = regBranch.trim();

        const newUser = {
            id: 'user-' + Date.now(),
            username,
            email,
            fullName: username,
            college,
            branch,
            password: regPassword, // In production, this should be hashed
            role: 'student',
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        try {
            // Try API registration first
            const result = await register({
                username,
                email,
                fullName: username,
                password: regPassword
            });

            if (result.success) {
                // Also save to localStorage as backup
                const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                existingUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

                setMessage({ 
                    text: '✅ Account created successfully! Redirecting to login...', 
                    type: 'success' 
                });
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.log('API registration failed, saving to offline mode...');
            
            // Fallback: Save user to localStorage
            try {
                const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                existingUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

                setMessage({ 
                    text: '✅ Account created! (Offline Mode) Redirecting to login...', 
                    type: 'success' 
                });
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (storageError) {
                setMessage({ 
                    text: '❌ Failed to register user. Please try again.', 
                    type: 'error' 
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthText = () => {
        const strengths = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return strengths[passwordStrength] || 'Very Weak';
    };

    const getPasswordStrengthColor = () => {
        const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#16a34a'];
        return colors[passwordStrength] || '#ef4444';
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
                            <li><span className="benefit-icon">🎯</span> Access 500+ curated internship opportunities</li>
                            <li><span className="benefit-icon">🏢</span> Connect with top companies worldwide</li>
                            <li><span className="benefit-icon">📊</span> Track applications in real-time</li>
                            <li><span className="benefit-icon">📄</span> Build a professional profile</li>
                            <li><span className="benefit-icon">🔔</span> Get personalized recommendations</li>
                        </ul>
                        
                        <div className="demo-accounts">
                            <p>Join thousands of students already on InternHub</p>
                            <div className="auth-trust-badges">
                                <span className="trust-badge">🔒 Secure</span>
                                <span className="trust-badge">✓ Verified Companies</span>
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
                                        <span className="input-icon">👤</span>
                                        <input 
                                            type="text" 
                                            id="regUsername" 
                                            name="regUsername"
                                            placeholder="Choose a username"
                                            value={formData.regUsername}
                                            onChange={handleChange}
                                            minLength="3"
                                            maxLength="20"
                                            required 
                                        />
                                    </div>
                                    <small className="form-helper">3-20 characters, letters/numbers/underscore only</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="regEmail">Email</label>
                                    <div className="input-with-icon">
                                        <span className="input-icon">✉️</span>
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
                                        <span className="input-icon">🎓</span>
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
                                        <span className="input-icon">📚</span>
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
                                    {formData.regPassword && (
                                        <div className="password-strength">
                                            <div className="strength-bars">
                                                {[...Array(5)].map((_, i) => (
                                                    <div 
                                                        key={i}
                                                        className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
                                                        style={{ backgroundColor: i < passwordStrength ? getPasswordStrengthColor() : '#e5e7eb' }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <small style={{ color: getPasswordStrengthColor() }}>
                                                Strength: {getPasswordStrengthText()}
                                            </small>
                                        </div>
                                    )}
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
                                    {formData.regPassword && formData.regConfirmPassword && (
                                        <small style={{ color: formData.regPassword === formData.regConfirmPassword ? '#22c55e' : '#ef4444' }}>
                                            {formData.regPassword === formData.regConfirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </small>
                                    )}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create My Account'}
                        </button>
                    </form>                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                            <p><Link to="/">← Back to Home</Link></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Register;
