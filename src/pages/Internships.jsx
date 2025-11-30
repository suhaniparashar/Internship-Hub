import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showMessage } from '../utils/notifications';

function Internships() {
    const navigate = useNavigate();
    const { loggedInUser, internships, applyForInternship, hasApplied, isLoading } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [filterStipend, setFilterStipend] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [savedJobs, setSavedJobs] = useState(JSON.parse(localStorage.getItem('savedJobs')) || []);
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    // Get unique locations and companies from internships
    const locations = ['all', ...new Set(internships.map(i => i.location))];
    const companies = ['all', ...new Set(internships.map(i => i.company))];
    const types = ['all', ...new Set(internships.map(i => i.type))];

    // Filter and search internships
    let filteredInternships = internships.filter(i => {
        const matchSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchType = filterType === 'all' || i.type === filterType;
        const matchLocation = filterLocation === 'all' || i.location === filterLocation;
        
        let matchStipend = true;
        if (filterStipend !== 'all') {
            const stipendAmount = parseInt(i.stipend.replace(/[^0-9]/g, ''));
            if (filterStipend === '10-20') matchStipend = stipendAmount >= 10000 && stipendAmount < 20000;
            else if (filterStipend === '20-30') matchStipend = stipendAmount >= 20000 && stipendAmount < 30000;
            else if (filterStipend === '30+') matchStipend = stipendAmount >= 30000;
        }
        
        const matchSaved = !showSavedOnly || savedJobs.includes(i.id);
        
        return matchSearch && matchType && matchLocation && matchStipend && matchSaved;
    });

    // Sort internships
    if (sortBy === 'newest') {
        filteredInternships.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'popular') {
        filteredInternships.sort((a, b) => b.applicants - a.applicants);
    } else if (sortBy === 'stipend-high') {
        filteredInternships.sort((a, b) => parseInt(b.stipend) - parseInt(a.stipend));
    } else if (sortBy === 'stipend-low') {
        filteredInternships.sort((a, b) => parseInt(a.stipend) - parseInt(b.stipend));
    } else if (sortBy === 'rating') {
        filteredInternships.sort((a, b) => b.rating - a.rating);
    }

    const handleApply = (internshipId) => {
        if (!loggedInUser) {
            showMessage('Please login to apply for internships', 'warning');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        
        if (hasApplied(internshipId)) {
            showMessage('You have already applied to this internship', 'warning');
            return;
        }
        
        if (applyForInternship(internshipId)) {
            showMessage('Application submitted successfully!', 'success');
        } else {
            showMessage('Failed to apply. Please try again.', 'error');
        }
    };

    const toggleSaveJob = (internshipId) => {
        const updatedSavedJobs = savedJobs.includes(internshipId)
            ? savedJobs.filter(id => id !== internshipId)
            : [...savedJobs, internshipId];
        setSavedJobs(updatedSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        const isSaved = updatedSavedJobs.includes(internshipId);
        showMessage(isSaved ? 'Job saved!' : 'Job removed from saved', 'success');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        setFilterLocation('all');
        setFilterStipend('all');
        setSortBy('newest');
        setShowSavedOnly(false);
    };

    return (
        <>
            <Navbar />
            
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Internship Opportunities</h1>
                    <p>Find your perfect internship from 1,000+ verified positions</p>
                </div>
            </section>

            {/* Internships Section */}
            <section className="internships-section">
                <div className="container">
                    {/* Search Bar */}
                    <div className="search-bar" style={{ marginBottom: '2rem' }}>
                        <input 
                            type="text" 
                            placeholder="🔍 Search by role, company, or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Filters Section */}
                    <div className="filters-container" style={{ marginBottom: '2rem' }}>
                        <div className="filters-grid">
                            <div className="filter-group">
                                <label>📍 Location</label>
                                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>💼 Type</label>
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    {types.map(type => (
                                        <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>💰 Stipend</label>
                                <select value={filterStipend} onChange={(e) => setFilterStipend(e.target.value)}>
                                    <option value="all">All Stipends</option>
                                    <option value="10-20">₹10K - ₹20K</option>
                                    <option value="20-30">₹20K - ₹30K</option>
                                    <option value="30+">₹30K+</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>📊 Sort By</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Most Applied</option>
                                    <option value="stipend-high">Highest Stipend</option>
                                    <option value="stipend-low">Lowest Stipend</option>
                                    <option value="rating">Best Rated</option>
                                </select>
                            </div>
                        </div>
                        <div className="filters-actions">
                            <button 
                                className={`btn-toggle-saved ${showSavedOnly ? 'active' : ''}`}
                                onClick={() => setShowSavedOnly(!showSavedOnly)}
                            >
                                ❤️ Saved ({savedJobs.length})
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear All</button>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="internships-header">
                        <div className="filter-bar">
                            <p className="internship-count">
                                {isLoading ? '⏳ Loading internships...' : `✨ Showing ${filteredInternships.length} of ${internships.length} internship${filteredInternships.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>
                    
                    {/* Internships Grid */}
                    <div className="internships-grid" id="internshipsGrid">
                        {isLoading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Fetching amazing opportunities for you...</p>
                            </div>
                        ) : filteredInternships.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No internships found</h3>
                                <p>Try adjusting your filters or search terms to find more opportunities</p>
                                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            filteredInternships.map(internship => (
                                <div key={internship.id} className="internship-card">
                                    <div className="card-header-actions">
                                        <span className="company-badge">{internship.company}</span>
                                        <button 
                                            className={`btn-save ${savedJobs.includes(internship.id) ? 'saved' : ''}`}
                                            onClick={() => toggleSaveJob(internship.id)}
                                            title={savedJobs.includes(internship.id) ? 'Remove from saved' : 'Save for later'}
                                        >
                                            {savedJobs.includes(internship.id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                    <div className="internship-header">
                                        <h3>{internship.title}</h3>
                                        <div className="internship-rating">⭐ {internship.rating || 4.5}</div>
                                    </div>
                                    <div className="internship-details">
                                        <div className="detail-item">
                                            <span className="detail-label">📅 Duration:</span>
                                            <span className="detail-value">{internship.duration}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">📍 Location:</span>
                                            <span className="detail-value">{internship.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">💰 Stipend:</span>
                                            <span className="detail-value stipend-value">{internship.stipend}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">👥 Applicants:</span>
                                            <span className="detail-value">{internship.applicants?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <p className="internship-description">{internship.description}</p>
                                    <div className="skills-container">
                                        {internship.skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                    <div className="internship-footer">
                                        <span className="deadline">📅 Deadline: {internship.deadline || 'Check website'}</span>
                                        <button 
                                            className={`btn-apply ${hasApplied(internship.id) ? 'applied' : ''}`}
                                            onClick={() => handleApply(internship.id)}
                                            disabled={hasApplied(internship.id)}
                                        >
                                            {hasApplied(internship.id) ? '✓ Already Applied' : 'Apply Now'}
                                        </button>
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

export default Internships;
