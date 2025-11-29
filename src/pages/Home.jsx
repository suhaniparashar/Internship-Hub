import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Home() {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
        setEmail('');
    };

    return (
        <>
            <Navbar />
            
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge">🚀 Your Professional Journey Awaits</span>
                        <h1 className="hero-title">Land Your Dream Internship at Top Companies</h1>
                        <p className="hero-subtitle">Accelerate your career with hands-on experience from industry leaders</p>
                        <p className="hero-description">
                            Join 50,000+ successful interns who have grown their careers at Google, Microsoft, Amazon, Meta, 
                            and 1,000+ global companies. Get mentored by industry experts, build real-world projects, and earn 
                            competitive stipends.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/internships" className="btn btn-primary">
                                Browse Opportunities
                            </Link>
                            <Link to="/register" className="btn btn-outline">
                                Create Free Account
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">1,000+</span>
                                <span className="stat-label">Partner Companies</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">50K+</span>
                                <span className="stat-label">Successful Placements</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">₹14-30K</span>
                                <span className="stat-label">Monthly Stipends</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-section">
                <div className="container">
                    <p className="trusted-label">Trusted by students from leading universities across India and globally</p>
                    <div className="trusted-logos">
                        <span className="university-logo">IIT Delhi</span>
                        <span className="university-logo">MIT</span>
                        <span className="university-logo">Stanford</span>
                        <span className="university-logo">NIT Bangalore</span>
                        <span className="university-logo">Oxford</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Us?</h2>
                    <p className="section-subtitle">Complete internship platform built for your success</p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-briefcase"></div>
                            <h3>Verified Opportunities</h3>
                            <p>Access 1,000+ verified internships from Fortune 500 companies, funded startups, and industry leaders worldwide.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-bolt"></div>
                            <h3>Smart Matching</h3>
                            <p>AI-powered recommendations based on your skills, interests, and career goals. Get personalized internship suggestions.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-chart"></div>
                            <h3>Real-Time Updates</h3>
                            <p>Instant notifications on application status, interview schedules, and important updates from companies.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper icon-graduation"></div>
                            <h3>Career Growth</h3>
                            <p>Mentorship from industry experts, hands-on projects, skill development, and permanent job opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">Get Started in 4 Steps</h2>
                    <p className="section-subtitle">Your path to a successful internship is straightforward</p>
                    
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <h3>Create Account</h3>
                            <p>Sign up with your email. Build your professional profile with your skills, education, and experience in minutes.</p>
                            <div className="step-icon">🔐</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">02</div>
                            <h3>Complete Profile</h3>
                            <p>Add resume, projects, skills, and preferences. Improve match quality and get recommendations from top companies.</p>
                            <div className="step-icon">📝</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">03</div>
                            <h3>Apply & Track</h3>
                            <p>Browse opportunities with filters and apply in one click. Track all applications with real-time status updates.</p>
                            <div className="step-icon">🔍</div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card">
                            <div className="step-number">04</div>
                            <h3>Get Hired</h3>
                            <p>Interview with companies, get selected, and start your internship. Earn competitive stipends and gain industry experience.</p>
                            <div className="step-icon">🎉</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Internship Journey?</h2>
                        <p>Join thousands of successful interns. Discover opportunities that match your skills and ambitions.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Free Account
                            </Link>
                            <Link to="/internships" className="btn btn-outline-dark">
                                Explore Internships
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title">Success Stories</h2>
                    <p className="section-subtitle">Real feedback from interns who transformed their careers</p>
                    
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"This platform helped me land an internship at Google. The matching algorithm was spot-on, and the entire process was seamless. Highly recommended!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">AK</div>
                                <div className="author-info">
                                    <p className="author-name">Aditya Kumar</p>
                                    <p className="author-role">Frontend Developer @ Google</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"I got my first internship through this platform. The mentorship and real-world projects were invaluable. Now I have a full-time offer!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">PS</div>
                                <div className="author-info">
                                    <p className="author-name">Priya Singh</p>
                                    <p className="author-role">Data Scientist @ Microsoft</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">"Easy to use, great support, and the internships are from reputable companies. I learned more in 3 months than in a year of college!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">RV</div>
                                <div className="author-info">
                                    <p className="author-name">Rohit Verma</p>
                                    <p className="author-role">Backend Engineer @ Amazon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Is the platform really free?</h3>
                            <p>Yes! Creating an account and browsing internships is completely free. We monetize through company partnerships, not student fees.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What's the average stipend?</h3>
                            <p>Stipends range from ₹14,000 to ₹30,000+ per month depending on role, company, and experience. Competitive packages are guaranteed.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I apply for multiple internships?</h3>
                            <p>Yes! You can apply to as many internships as you want. We recommend applying to roles that match your skills and interests.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Do I need prior experience?</h3>
                            <p>No! We have internships for freshers and experienced students. Many companies provide on-the-job training.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Are remote internships available?</h3>
                            <p>Yes! Most companies offer remote, hybrid, or office-based roles. You can filter by work location preference.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What if I don't get selected?</h3>
                            <p>Keep applying! We have 1,000+ opportunities. Use our skill recommendations to improve your profile and increase chances.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <h2>Get Weekly Internship Alerts</h2>
                        <p>Subscribe to get the latest opportunities matching your profile, delivered to your inbox</p>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input 
                                type="email" 
                                placeholder="your@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Home;
