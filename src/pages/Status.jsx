import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showMessage } from '../utils/notifications';

function Status() {
    const navigate = useNavigate();
    const { loggedInUser, getUserApplications, internships, applications } = useAppContext();
    const [userApplications, setUserApplications] = useState([]);

    useEffect(() => {
        if (!loggedInUser) {
            showMessage('Please login to access this page', 'warning');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        loadApplicationStatus();
    }, [loggedInUser, navigate, applications]);

    const loadApplicationStatus = () => {
        const userApps = getUserApplications();
        // Enrich with internship details
        const enrichedApps = userApps.map(app => {
            const internship = internships.find(i => i.id === app.internshipId);
            return {
                ...app,
                internshipTitle: internship?.title || 'Unknown Internship',
                company: internship?.company || 'Unknown Company',
                status: app.status || 'Applied',
                evaluation: app.evaluation || 'Not Evaluated'
            };
        });
        setUserApplications(enrichedApps);
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'applied': return 'status-pending';
            case 'under review': return 'status-pending';
            case 'shortlisted': return 'status-selected';
            case 'rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    const getEvaluationClass = (evaluation) => {
        switch (evaluation?.toLowerCase()) {
            case 'selected': return 'status-selected';
            case 'rejected': return 'status-rejected';
            case 'shortlisted': return 'status-pending';
            default: return 'status-pending';
        }
    };

    if (!loggedInUser) return null;

    return (
        <>
            <Navbar />
            
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Application Status</h1>
                    <p>Track the progress of your internship applications</p>
                </div>
            </section>

            {/* Status Legend */}
            <section className="status-legend">
                <div className="container">
                    <div className="legend-items">
                        <div className="legend-item">
                            <span className="status-badge status-pending">Applied / Under Review</span>
                            <p>Application received</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-badge status-selected">Shortlisted / Selected</span>
                            <p>Congratulations!</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-badge status-rejected">Rejected</span>
                            <p>Better luck next time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Status Section */}
            <section className="status-section">
                <div className="container">
                    <div className="status-header">
                        <h2>Your Applications ({userApplications.length})</h2>
                    </div>
                    
                    <div className="status-container" id="statusContainer">
                        {userApplications.length === 0 ? (
                            <div className="empty-state">
                                <p className="no-applications">
                                    No applications to track. <Link to="/internships">Apply to internships</Link>
                                </p>
                            </div>
                        ) : (
                            userApplications.map((app, index) => (
                                <div key={app.id || index} className="status-card">
                                    <div className="status-card-header">
                                        <h3>{app.internshipTitle}</h3>
                                        <span className={`status-badge ${getStatusClass(app.status)}`}>{app.status}</span>
                                    </div>
                                    <div className="status-details">
                                        <p><strong>Company:</strong> {app.company}</p>
                                        <p><strong>Applied on:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        <p><strong>Evaluation:</strong> 
                                            <span className={`status-badge ${getEvaluationClass(app.evaluation)}`} style={{ marginLeft: '0.5rem' }}>
                                                {app.evaluation}
                                            </span>
                                        </p>
                                        {app.adminFeedback && (
                                            <p><strong>Feedback:</strong> {app.adminFeedback}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Status;
