import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showMessage, showConfirmModal } from '../utils/notifications';
import { formatDate } from '../utils/formatDate';
import '../styles/Admin.css';

function Admin() {
  const navigate = useNavigate();
  const { 
    loggedInUser, 
    users, 
    internships, 
    applications: contextApplications,
    tasks: contextTasks,
    applicationAPI, 
    internshipAPI,
    addTaskToApplication,
    deleteTask,
    fetchAllData 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    applicationId: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  });
  
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

  useEffect(() => {
    if (contextApplications) {
      setApplications(contextApplications);
    }
  }, [contextApplications]);

  useEffect(() => {
    if (contextTasks) {
      setTasks(contextTasks);
    }
  }, [contextTasks]);

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
      await fetchAllData();
    } catch (error) {
      showMessage('Failed to create internship', 'error');
    }
  };

  const handleDeleteInternship = (internshipId) => {
    showConfirmModal('Delete this internship?', async () => {
      try {
        await internshipAPI.delete(internshipId);
        await fetchAllData();
        showMessage('Internship deleted!', 'success');
      } catch (error) {
        showMessage('Failed to delete internship', 'error');
      }
    });
  };

  // Update application status with logical constraints
  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    const app = applications.find(a => a.id === appId);
    
    // Logical validation
    if (app.evaluation === 'Selected' && newStatus === 'Rejected') {
      showMessage('Cannot reject a selected candidate. Change evaluation first.', 'warning');
      return;
    }
    
    if (app.evaluation === 'Rejected' && newStatus === 'Shortlisted') {
      showMessage('Cannot shortlist a rejected candidate. Change evaluation first.', 'warning');
      return;
    }

    try {
      await applicationAPI.updateStatus(appId, newStatus);
      
      // Auto-update evaluation based on status
      if (newStatus === 'Rejected' && app.evaluation !== 'Rejected') {
        await applicationAPI.addFeedback(appId, 'Application rejected', 'Rejected');
      }
      
      await loadApplications();
      showMessage('Status updated!', 'success');
    } catch (error) {
      showMessage('Failed to update status', 'error');
    }
  };

  // Update evaluation with logical constraints  
  const handleUpdateEvaluation = async (appId, evaluation) => {
    const app = applications.find(a => a.id === appId);
    
    // Logical validation
    if (evaluation === 'Selected' && app.status === 'Applied') {
      showMessage('Please review the application first (change status to Under Review or Shortlisted)', 'warning');
      return;
    }
    
    if (evaluation === 'Selected' && app.status === 'Rejected') {
      showMessage('Cannot select a rejected application. Update status first.', 'warning');
      return;
    }

    try {
      await applicationAPI.addFeedback(appId, `Evaluation: ${evaluation}`, evaluation);
      
      // Auto-update status based on evaluation
      if (evaluation === 'Selected' && app.status !== 'Shortlisted') {
        await applicationAPI.updateStatus(appId, 'Shortlisted');
      }
      if (evaluation === 'Rejected' && app.status !== 'Rejected') {
        await applicationAPI.updateStatus(appId, 'Rejected');
      }
      
      await loadApplications();
      showMessage('Evaluation updated!', 'success');
    } catch (error) {
      showMessage('Failed to update evaluation', 'error');
    }
  };

  const handleAssignTask = async (applicationId) => {
    const app = applications.find(a => a.id === applicationId);
    
    // Validate - can only assign tasks to selected/shortlisted candidates
    if (!app || app.evaluation === 'Rejected' || app.status === 'Rejected') {
      showMessage('Cannot assign tasks to rejected applications', 'error');
      return;
    }
    
    if (app.status === 'Applied') {
      showMessage('Please review and shortlist/select the candidate first', 'warning');
      return;
    }
    
    if (!taskForm.title || !taskForm.deadline) {
      showMessage('Task title and deadline are required', 'warning');
      return;
    }
    
    // Validate deadline is in the future
    if (new Date(taskForm.deadline) < new Date()) {
      showMessage('Deadline must be a future date', 'warning');
      return;
    }

    try {
      const result = await addTaskToApplication(applicationId, {
        title: taskForm.title,
        description: taskForm.description,
        deadline: taskForm.deadline,
        priority: taskForm.priority
      });

      if (result.success) {
        showMessage('Task assigned successfully!', 'success');
        setTaskForm({ applicationId: '', title: '', description: '', deadline: '', priority: 'Medium' });
        await fetchAllData();
      } else {
        showMessage(result.error || 'Failed to assign task', 'error');
      }
    } catch (error) {
      showMessage('Failed to assign task', 'error');
    }
  };

  const handleDeleteTask = (taskId) => {
    showConfirmModal('Delete this task?', async () => {
      try {
        const result = await deleteTask(taskId);
        if (result.success) {
          showMessage('Task deleted!', 'success');
          await fetchAllData();
        } else {
          showMessage(result.error || 'Failed to delete task', 'error');
        }
      } catch (error) {
        showMessage('Failed to delete task', 'error');
      }
    });
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setTaskForm({ applicationId: '', title: '', description: '', deadline: '', priority: 'Medium' });
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
    setTaskForm({ applicationId: '', title: '', description: '', deadline: '', priority: 'Medium' });
  };

  const getUserApplications = (userId) => {
    return applications.filter(app => app.userId === userId);
  };

  const getUserTasks = (userId) => {
    const userApps = getUserApplications(userId);
    const appIds = userApps.map(a => a.id);
    return tasks.filter(t => appIds.includes(t.applicationId));
  };

  const getStats = () => {
    return {
      totalUsers: users.filter(u => !u.isAdmin).length,
      totalInternships: internships.length,
      totalApplications: applications.length,
      totalSelected: applications.filter(a => a.evaluation === 'Selected').length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status !== 'Completed').length
    };
  };

  const stats = getStats();
  
  const filteredApplications = applications.filter(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    const user = users.find(u => u.id === app.userId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      internship?.title?.toLowerCase().includes(searchLower) ||
      user?.fullName?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower)
    );
  });

  const filteredUsers = users.filter(u => !u.isAdmin).filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.college?.toLowerCase().includes(searchLower)
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

      <section className="admin-container">
        <div className="container">
          <div className="admin-layout">
            {/* Sidebar */}
            <div className="admin-sidebar">
              <h3>Navigation</h3>
              <nav className="admin-nav">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={activeTab === 'overview' ? 'active' : ''}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('internships')}
                  className={activeTab === 'internships' ? 'active' : ''}
                >
                  💼 Internships
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={activeTab === 'applications' ? 'active' : ''}
                >
                  📋 Applications
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={activeTab === 'users' ? 'active' : ''}
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
                  <h2>📊 Dashboard Overview</h2>
                  <p className="section-subtitle">Monitor your platform's key metrics at a glance</p>
                  
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👥</div>
                      <div className="admin-stat-value">{stats.totalUsers}</div>
                      <div className="admin-stat-label">Total Students</div>
                    </div>
                    <div className="admin-stat-card success">
                      <div className="admin-stat-icon">💼</div>
                      <div className="admin-stat-value">{stats.totalInternships}</div>
                      <div className="admin-stat-label">Total Internships</div>
                    </div>
                    <div className="admin-stat-card warning">
                      <div className="admin-stat-icon">📋</div>
                      <div className="admin-stat-value">{stats.totalApplications}</div>
                      <div className="admin-stat-label">Total Applications</div>
                    </div>
                    <div className="admin-stat-card info">
                      <div className="admin-stat-icon">✅</div>
                      <div className="admin-stat-value">{stats.totalSelected}</div>
                      <div className="admin-stat-label">Selected</div>
                    </div>
                  </div>

                  <h3 className="section-title">📝 Task Statistics</h3>
                  <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">📑</div>
                      <div className="admin-stat-value">{stats.totalTasks}</div>
                      <div className="admin-stat-label">Total Tasks</div>
                    </div>
                    <div className="admin-stat-card warning">
                      <div className="admin-stat-icon">⏳</div>
                      <div className="admin-stat-value">{stats.pendingTasks}</div>
                      <div className="admin-stat-label">Pending Tasks</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <h3 className="section-title">⚡ Quick Actions</h3>
                  <div className="quick-actions-grid">
                    <button className="quick-action-btn" onClick={() => setActiveTab('internships')}>
                      <span className="qa-icon">➕</span>
                      <span className="qa-text">Add Internship</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('applications')}>
                      <span className="qa-icon">📝</span>
                      <span className="qa-text">Review Applications</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('users')}>
                      <span className="qa-icon">👤</span>
                      <span className="qa-text">Manage Users</span>
                    </button>
                  </div>
                </div>
              )}

              {/* INTERNSHIPS TAB */}
              {activeTab === 'internships' && (
                <div className="admin-section">
                  <h2>💼 Manage Internships ({internships.length})</h2>
                  
                  <div className="create-form-container">
                    <h3>➕ Create New Internship</h3>
                    <div className="create-form-grid">
                      <input type="text" placeholder="Title *" value={newInternship.title} onChange={(e) => setNewInternship({...newInternship, title: e.target.value})} />
                      <input type="text" placeholder="Company *" value={newInternship.company} onChange={(e) => setNewInternship({...newInternship, company: e.target.value})} />
                      <input type="text" placeholder="Duration" value={newInternship.duration} onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})} />
                      <input type="text" placeholder="Location" value={newInternship.location} onChange={(e) => setNewInternship({...newInternship, location: e.target.value})} />
                      <input type="text" placeholder="Stipend" value={newInternship.stipend} onChange={(e) => setNewInternship({...newInternship, stipend: e.target.value})} />
                      <input type="date" value={newInternship.deadline} onChange={(e) => setNewInternship({...newInternship, deadline: e.target.value})} />
                    </div>
                    <textarea className="full-width" placeholder="Description" value={newInternship.description} onChange={(e) => setNewInternship({...newInternship, description: e.target.value})} />
                    <input className="full-width" type="text" placeholder="Skills (comma-separated)" value={newInternship.skills} onChange={(e) => setNewInternship({...newInternship, skills: e.target.value})} />
                    <button className="btn btn-primary create-btn" onClick={handleCreateInternship}>Create Internship</button>
                  </div>

                  <h3 className="section-title">📋 All Internships</h3>
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Stipend</th>
                          <th>Applications</th>
                          <th>Deadline</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internships.map(internship => (
                          <tr key={internship.id}>
                            <td><strong>{internship.title}</strong></td>
                            <td>{internship.company}</td>
                            <td className="stipend-cell">{internship.stipend}</td>
                            <td>{internship.applicants}</td>
                            <td>{formatDate(internship.deadline)}</td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteInternship(internship.id)}>Delete</button>
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
                  <h2>📋 Review Applications ({filteredApplications.length})</h2>
                  
                  {/* Application Flow Guide */}
                  <div className="flow-guide">
                    <h4>📊 Application Process Flow:</h4>
                    <div className="flow-steps">
                      <span className="flow-step applied">📥 Applied</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step review">🔍 Under Review</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step shortlisted">⭐ Shortlisted</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-step selected">✅ Selected</span>
                      <span className="flow-step rejected">/ ❌ Rejected</span>
                    </div>
                  </div>
                  
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="🔍 Search by internship title or student name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Internship</th>
                          <th>Applied</th>
                          <th>Status</th>
                          <th>Final Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map(app => {
                          const internship = internships.find(i => i.id === app.internshipId);
                          const user = users.find(u => u.id === app.userId);
                          const isRejected = app.evaluation === 'Rejected' || app.status === 'Rejected';
                          const isSelected = app.evaluation === 'Selected';
                          const canSelect = app.status === 'Shortlisted' || app.status === 'Under Review';
                          
                          return (
                            <tr key={app.id} className={isRejected ? 'row-rejected' : isSelected ? 'row-selected' : ''}>
                              <td>{user?.fullName || 'Unknown'}</td>
                              <td><strong>{internship?.title || 'N/A'}</strong></td>
                              <td>{formatDate(app.appliedAt)}</td>
                              <td>
                                <select 
                                  className="status-select" 
                                  value={app.status} 
                                  onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                                  disabled={isSelected}
                                >
                                  <option value="Applied">📥 Applied</option>
                                  <option value="Under Review">🔍 Under Review</option>
                                  <option value="Shortlisted">⭐ Shortlisted</option>
                                  <option value="Rejected">❌ Rejected</option>
                                </select>
                              </td>
                              <td>
                                {isSelected ? (
                                  <span className="evaluation-badge selected">✅ Selected</span>
                                ) : isRejected ? (
                                  <span className="evaluation-badge rejected">❌ Rejected</span>
                                ) : (
                                  <div className="action-buttons-inline">
                                    <button 
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleUpdateEvaluation(app.id, 'Selected')}
                                      disabled={!canSelect}
                                      title={!canSelect ? 'Review or shortlist first' : 'Select this candidate'}
                                    >
                                      ✓ Select
                                    </button>
                                    <button 
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleUpdateEvaluation(app.id, 'Rejected')}
                                    >
                                      ✗ Reject
                                    </button>
                                  </div>
                                )}
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
                  <h2>👥 Manage Users ({filteredUsers.length})</h2>
                  
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="🔍 Search by name, email, or college..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>College</th>
                          <th>Applications</th>
                          <th>Tasks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => {
                          const userApps = getUserApplications(user.id);
                          const userTasks = getUserTasks(user.id);
                          return (
                            <tr key={user.id}>
                              <td><strong>{user.fullName}</strong></td>
                              <td>{user.email}</td>
                              <td>{user.college || '-'}</td>
                              <td>{userApps.length}</td>
                              <td>{userTasks.length}</td>
                              <td>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openUserDetails(user)}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* USER DETAILS MODAL */}
      {showUserModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={closeUserModal}>
          <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeUserModal}>×</button>
            
            <div className="user-detail-header">
              <div className="user-avatar-large">
                {selectedUser.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="user-detail-info">
                <h2>{selectedUser.fullName}</h2>
                <p className="user-email">{selectedUser.email}</p>
                <div className="user-meta">
                  <span>🎓 {selectedUser.college || 'N/A'}</span>
                  <span>📚 {selectedUser.branch || 'N/A'}</span>
                  <span>📅 Joined: {formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="user-detail-content">
              {/* Applied Internships Section */}
              <div className="user-section">
                <h3>📋 Applied Internships ({getUserApplications(selectedUser.id).length})</h3>
                {getUserApplications(selectedUser.id).length === 0 ? (
                  <p className="empty-message">No applications yet</p>
                ) : (
                  <div className="application-cards">
                    {getUserApplications(selectedUser.id).map(app => {
                      const internship = internships.find(i => i.id === app.internshipId);
                      const appTasks = tasks.filter(t => t.applicationId === app.id);
                      return (
                        <div key={app.id} className="application-card">
                          <div className="app-card-header">
                            <h4>{internship?.title || 'Unknown Internship'}</h4>
                            <span className={`status-badge ${app.status?.toLowerCase().replace(' ', '-')}`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="app-card-details">
                            <p><strong>Company:</strong> {internship?.company || 'N/A'}</p>
                            <p><strong>Applied:</strong> {formatDate(app.appliedAt)}</p>
                            <p><strong>Evaluation:</strong> 
                              <span className={`eval-badge ${app.evaluation?.toLowerCase() || 'pending'}`}>
                                {app.evaluation || 'Pending'}
                              </span>
                            </p>
                          </div>

                          {/* Tasks for this application */}
                          <div className="app-tasks-section">
                            <h5>📝 Tasks ({appTasks.length})</h5>
                            {appTasks.length > 0 ? (
                              <div className="task-mini-list">
                                {appTasks.map(task => (
                                  <div key={task.id} className="task-mini-item">
                                    <div className="task-mini-info">
                                      <span className="task-title">{task.title}</span>
                                      <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                    <div className="task-mini-meta">
                                      <span>📅 Due: {formatDate(task.deadline)}</span>
                                      <span className={`task-status ${task.status?.toLowerCase() || 'pending'}`}>
                                        {task.status || 'Pending'}
                                      </span>
                                    </div>
                                    <button 
                                      className="btn btn-danger btn-xs"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="no-tasks">No tasks assigned</p>
                            )}

                            {/* Assign Task Form */}
                            {(app.status === 'Shortlisted' || app.evaluation === 'Selected') && (
                              <div className="assign-task-form">
                                <h6>➕ Assign New Task</h6>
                                <div className="task-form-inline">
                                  <input
                                    type="text"
                                    placeholder="Task title *"
                                    value={taskForm.applicationId === app.id ? taskForm.title : ''}
                                    onChange={(e) => setTaskForm({...taskForm, applicationId: app.id, title: e.target.value})}
                                    onFocus={() => setTaskForm({...taskForm, applicationId: app.id})}
                                  />
                                  <input
                                    type="date"
                                    placeholder="Deadline *"
                                    value={taskForm.applicationId === app.id ? taskForm.deadline : ''}
                                    onChange={(e) => setTaskForm({...taskForm, applicationId: app.id, deadline: e.target.value})}
                                    onFocus={() => setTaskForm({...taskForm, applicationId: app.id})}
                                  />
                                  <select
                                    value={taskForm.applicationId === app.id ? taskForm.priority : 'Medium'}
                                    onChange={(e) => setTaskForm({...taskForm, applicationId: app.id, priority: e.target.value})}
                                    onFocus={() => setTaskForm({...taskForm, applicationId: app.id})}
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                  </select>
                                </div>
                                <textarea
                                  placeholder="Task description (optional)"
                                  value={taskForm.applicationId === app.id ? taskForm.description : ''}
                                  onChange={(e) => setTaskForm({...taskForm, applicationId: app.id, description: e.target.value})}
                                  onFocus={() => setTaskForm({...taskForm, applicationId: app.id})}
                                />
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAssignTask(app.id)}
                                  disabled={taskForm.applicationId !== app.id || !taskForm.title || !taskForm.deadline}
                                >
                                  Assign Task
                                </button>
                              </div>
                            )}
                            {app.status !== 'Shortlisted' && app.evaluation !== 'Selected' && (
                              <p className="task-notice">⚠️ Shortlist or select this application to assign tasks</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Admin;
