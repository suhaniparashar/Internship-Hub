import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showMessage, showConfirmModal } from '../utils/notifications';
import { formatDate } from '../utils/formatDate';

function Admin() {
  const navigate = useNavigate();
  const { loggedInUser, users, internships, applicationAPI, internshipAPI, userAPI } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    duration: '',
    location: '',
    stipend: '',
    description: '',
    skills: '',
    type: 'Full-time',
    deadline: ''
  });

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.isAdmin) {
      showMessage('Access denied. Admin only.', 'error');
      navigate('/');
      return;
    }
    loadApplications();
  }, [loggedInUser, navigate]);

  const loadApplications = async () => {
    try {
      const allApps = await applicationAPI.getAll();
      setApplications(allApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const handleCreateInternship = async () => {
    if (!newInternship.title || !newInternship.company) {
      showMessage('Title and Company are required', 'warning');
      return;
    }

    try {
      const skillsArray = newInternship.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      await internshipAPI.create({
        ...newInternship,
        skills: skillsArray,
        rating: 4.5,
        applicants: 0
      });

      showMessage('Internship created successfully!', 'success');
      setNewInternship({
        title: '',
        company: '',
        duration: '',
        location: '',
        stipend: '',
        description: '',
        skills: '',
        type: 'Full-time',
        deadline: ''
      });
    } catch (error) {
      showMessage('Failed to create internship', 'error');
    }
  };

  const handleDeleteInternship = (internshipId) => {
    showConfirmModal('Delete this internship?', async () => {
      try {
        await internshipAPI.delete(internshipId);
        showMessage('Internship deleted!', 'success');
      } catch (error) {
        showMessage('Failed to delete internship', 'error');
      }
    });
  };

  const handleUpdateApplicationStatus = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, status);
      await loadApplications();
      showMessage('Status updated!', 'success');
    } catch (error) {
      showMessage('Failed to update status', 'error');
    }
  };

  const handleAddFeedback = async (appId, feedback, evaluation) => {
    try {
      await applicationAPI.addFeedback(appId, feedback, evaluation);
      await loadApplications();
      showMessage('Feedback added!', 'success');
    } catch (error) {
      showMessage('Failed to add feedback', 'error');
    }
  };

  const getStats = () => {
    return {
      totalUsers: users.filter(u => !u.isAdmin).length,
      totalInternships: internships.length,
      totalApplications: applications.length,
      totalSelected: applications.filter(a => a.evaluation === 'Selected').length
    };
  };

  const stats = getStats();
  const filteredApplications = applications.filter(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    const user = users.find(u => u.id === app.userId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      internship?.title.toLowerCase().includes(searchLower) ||
      user?.fullName.toLowerCase().includes(searchLower) ||
      user?.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <Navbar />
      
      <section className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage internships, applications, and users</p>
        </div>
      </section>

      <section className="admin-container" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
            {/* Sidebar */}
            <div className="admin-sidebar">
              <h3>Navigation</h3>
              <nav className="admin-nav">
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'overview' ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: activeTab === 'overview' ? '#b45309' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('internships')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'internships' ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: activeTab === 'internships' ? '#b45309' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  💼 Internships
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'applications' ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: activeTab === 'applications' ? '#b45309' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  📋 Applications
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'users' ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: activeTab === 'users' ? '#b45309' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  👥 Users
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="admin-content">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="admin-section">
                  <h2>Dashboard Overview</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', color: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 10px 15px rgba(180, 83, 9, 0.12)' }}>
                      <div style={{ fontSize: '2.25rem', fontWeight: '800', margin: '1rem 0' }}>{stats.totalUsers}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Students</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', color: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 10px 15px rgba(180, 83, 9, 0.12)' }}>
                      <div style={{ fontSize: '2.25rem', fontWeight: '800', margin: '1rem 0' }}>{stats.totalInternships}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Internships</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', color: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 10px 15px rgba(180, 83, 9, 0.12)' }}>
                      <div style={{ fontSize: '2.25rem', fontWeight: '800', margin: '1rem 0' }}>{stats.totalApplications}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Applications</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', color: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 10px 15px rgba(180, 83, 9, 0.12)' }}>
                      <div style={{ fontSize: '2.25rem', fontWeight: '800', margin: '1rem 0' }}>{stats.totalSelected}</div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected</div>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERNSHIPS TAB */}
              {activeTab === 'internships' && (
                <div className="admin-section">
                  <h2>Manage Internships ({internships.length})</h2>
                  
                  {/* Create Form */}
                  <div style={{ backgroundColor: '#fffbf0', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', marginTop: '1.5rem', border: '2px dashed #f3e8e0' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create New Internship</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <input type="text" placeholder="Title *" value={newInternship.title} onChange={(e) => setNewInternship({...newInternship, title: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                      <input type="text" placeholder="Company *" value={newInternship.company} onChange={(e) => setNewInternship({...newInternship, company: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                      <input type="text" placeholder="Duration" value={newInternship.duration} onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                      <input type="text" placeholder="Location" value={newInternship.location} onChange={(e) => setNewInternship({...newInternship, location: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                      <input type="text" placeholder="Stipend" value={newInternship.stipend} onChange={(e) => setNewInternship({...newInternship, stipend: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                      <input type="date" value={newInternship.deadline} onChange={(e) => setNewInternship({...newInternship, deadline: e.target.value})} style={{ padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }} />
                    </div>
                    <textarea placeholder="Description" value={newInternship.description} onChange={(e) => setNewInternship({...newInternship, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', marginTop: '1rem', fontFamily: 'inherit', minHeight: '80px' }} />
                    <input type="text" placeholder="Skills (comma-separated)" value={newInternship.skills} onChange={(e) => setNewInternship({...newInternship, skills: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', marginTop: '1rem', fontFamily: 'inherit' }} />
                    <button className="btn btn-primary" onClick={handleCreateInternship} style={{ marginTop: '1rem' }}>Create Internship</button>
                  </div>

                  {/* Internships List */}
                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Internships</h3>
                  <div className="admin-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Title</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Company</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Stipend</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Applications</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Deadline</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internships.map(internship => (
                          <tr key={internship.id} style={{ borderBottom: '1px solid #f3e8e0' }}>
                            <td style={{ padding: '1rem', color: '#6b7280' }}><strong>{internship.title}</strong></td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{internship.company}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{internship.stipend}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{internship.applicants}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{formatDate(internship.deadline)}</td>
                            <td style={{ padding: '1rem' }}>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteInternship(internship.id)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="admin-section">
                  <h2>Review Applications ({filteredApplications.length})</h2>
                  
                  <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="Search by internship title or student name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #f3e8e0', borderRadius: '0.5rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div className="admin-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fffbf0', borderRadius: '0.75rem' }}>
                      <thead style={{ background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Student</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Internship</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Applied</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Status</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Evaluation</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map(app => {
                          const internship = internships.find(i => i.id === app.internshipId);
                          const user = users.find(u => u.id === app.userId);
                          return (
                            <tr key={app.id} style={{ borderBottom: '1px solid #f3e8e0' }}>
                              <td style={{ padding: '1rem', color: '#6b7280' }}>{user?.fullName || 'Unknown'}</td>
                              <td style={{ padding: '1rem', color: '#6b7280' }}><strong>{internship?.title || 'N/A'}</strong></td>
                              <td style={{ padding: '1rem', color: '#6b7280' }}>{formatDate(app.appliedAt)}</td>
                              <td style={{ padding: '1rem', color: '#6b7280' }}>
                                <select value={app.status} onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)} style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                                  <option>Applied</option>
                                  <option>Under Review</option>
                                  <option>Shortlisted</option>
                                  <option>Rejected</option>
                                </select>
                              </td>
                              <td style={{ padding: '1rem', color: '#6b7280' }}>
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: '700', backgroundColor: app.evaluation === 'Selected' ? 'rgba(22, 163, 74, 0.1)' : app.evaluation === 'Rejected' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(180, 83, 9, 0.1)', color: app.evaluation === 'Selected' ? '#16a34a' : app.evaluation === 'Rejected' ? '#dc2626' : '#b45309' }}>
                                  {app.evaluation}
                                </span>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <select onChange={(e) => handleAddFeedback(app.id, 'Good performance', e.target.value)} defaultValue="" style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                                  <option value="">Set Evaluation</option>
                                  <option value="Selected">✓ Selected</option>
                                  <option value="Rejected">✗ Rejected</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="admin-section">
                  <h2>Manage Users</h2>
                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Students ({users.filter(u => !u.isAdmin).length})</h3>
                  <div className="admin-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fffbf0' }}>
                      <thead style={{ background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Name</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Email</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>College</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Branch</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.5px' }}>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => !u.isAdmin).map(user => (
                          <tr key={user.id} style={{ borderBottom: '1px solid #f3e8e0' }}>
                            <td style={{ padding: '1rem', color: '#6b7280' }}><strong>{user.fullName}</strong></td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{user.email}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{user.college}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{user.branch}</td>
                            <td style={{ padding: '1rem', color: '#6b7280' }}>{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Admin;
