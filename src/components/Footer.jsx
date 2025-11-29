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
                        <div className="footer-social">
                            <a href="#" className="social-link social-link-linkedin" aria-label="LinkedIn"></a>
                            <a href="#" className="social-link social-link-twitter" aria-label="Twitter"></a>
                            <a href="#" className="social-link social-link-github" aria-label="GitHub"></a>
                            <a href="#" className="social-link social-link-email" aria-label="Email"></a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>For Students</h4>
                        <ul>
                            <li><Link to="/internships">Browse Internships</Link></li>
                            <li><Link to="/register">Create Account</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/status">Application Status</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/">About Us</Link></li>
                            <li><Link to="/">Careers</Link></li>
                            <li><Link to="/">Press</Link></li>
                            <li><Link to="/">Contact</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul>
                            <li><Link to="/">Career Blog</Link></li>
                            <li><Link to="/">Interview Tips</Link></li>
                            <li><Link to="/">Resume Guide</Link></li>
                            <li><Link to="/">Help Center</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} InternHub. All rights reserved.</p>
                        <div className="footer-links">
                            <Link to="/">Privacy Policy</Link>
                            <Link to="/">Terms of Service</Link>
                            <Link to="/">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
