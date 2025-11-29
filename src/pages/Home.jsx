import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Home() {
    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge">Your Career Starts Here</span>
                        <h1 className="hero-title">Launch Your Career with Premium Internships</h1>
                        <p className="hero-subtitle">Connect with Fortune 500 companies and innovative startups</p>
                        <p className="hero-description">
                            Join thousands of students who have landed their dream internships at Google, Microsoft, Amazon, 
                            and 500+ top companies. Your journey to a successful career begins here.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/internships" className="btn btn-primary">
                                Explore Opportunities
                            </Link>
                            <Link to="/register" className="btn btn-outline">
                                Get Started Free
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Partner Companies</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Students Placed</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">95%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-section">
                <div className="container">
                    <p className="trusted-label">Trusted by students from top universities worldwide</p>
                    <div className="trusted-logos">
                        <span className="university-logo">Stanford</span>
                        <span className="university-logo">MIT</span>
                        <span className="university-logo">Harvard</span>
                        <span className="university-logo">Caltech</span>
                        <span className="university-logo">Oxford</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose InternHub?</h2>
                    <p className="section-subtitle">Everything you need to land your dream internship</p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-briefcase"></div>
                            <h3>Premium Opportunities</h3>
                            <p>Access exclusive internships at Fortune 500 companies and fast-growing startups worldwide.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-bolt"></div>
                            <h3>One-Click Apply</h3>
                            <p>Streamlined application process lets you apply to multiple positions with a single profile.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-chart"></div>
                            <h3>Real-Time Tracking</h3>
                            <p>Monitor your application status instantly with our intuitive dashboard and notifications.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-graduation"></div>
                            <h3>Career Growth</h3>
                            <p>Build skills, gain experience, and receive mentorship from industry professionals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Get your dream internship in 4 simple steps</p>
                    
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <h3>Sign Up Free</h3>
                            <p>Create your account in 2 minutes with your email and basic information. No credit card required.</p>
                            <div className="step-icon">🔐</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">02</div>
                            <h3>Complete Profile</h3>
                            <p>Add your skills, experiences, and preferences to get personalized internship recommendations.</p>
                            <div className="step-icon">📝</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">03</div>
                            <h3>Explore & Apply</h3>
                            <p>Browse filtered internships and apply with one click. Track all your applications in real-time.</p>
                            <div className="step-icon">🔍</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">04</div>
                            <h3>Get Selected</h3>
                            <p>Receive interview invitations and get selected at your dream company. Start your career journey!</p>
                            <div className="step-icon">🎉</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Launch Your Career?</h2>
                        <p>Join thousands of students who have already found their dream internships</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started — It's Free
                            </Link>
                            <Link to="/internships" className="btn btn-outline-dark">
                                Browse Internships
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Home;
