import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section footer-brand">
                        <h3><span className="brand-icon brand-icon-target"></span> InternHub</h3>
                        <p>Your gateway to premium internships at top companies worldwide. Start your career journey today.</p>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/internships">Browse Internships</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>For Students</h4>
                        <ul>
                            <li><Link to="/register">Create Account</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/status">Application Status</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} InternHub. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
