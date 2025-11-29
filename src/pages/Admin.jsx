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
  const [selectedAppForTask, setSelectedAppForTask] = useState('');
  
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

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium'
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
      showMessage('Evaluation updated!', 'success');
    } catch (error) {
      showMessage('Failed to update evaluation', 'error');
    }
  };

  const handleAssignTask = async () => {
    if (!selectedAppForTask) {
      showMessage('Please select an application', 'warning');
      return;
    }
    if (!newTask.title || !newTask.deadline) {
      showMessage('Task title and deadline are required', 'warning');
      return;
    }

    try {
      const result = await addTaskToApplication(selectedAppForTask, {
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline,
        priority: newTask.priority
      });

      if (result.success) {
        showMessage('Task assigned successfully!', 'success');
        setNewTask({ title: '', description: '', deadline: '', priority: 'Medium' });
        setSelectedAppForTask('');
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

  const getApplicationDetails = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return { userName: 'Unknown', internshipTitle: 'Unknown' };
    const user = users.find(u => u.id === app.userId);
    const internship = internships.find(i => i.id === app.internshipId);
    return {
      userName: user?.fullName || 'Unknown',
      internshipTitle: internship?.title || 'Unknown'
    };
  };

  return (
    <>
      <Navbar />
      
      <section className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage internships, applications, tasks, and users</p>
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
                  onClick={() => setActiveTab('tasks')}
                  className={activeTab === 'tasks' ? 'active' : ''}
                >
                  ✅ Tasks
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
                  <h2>Dashboard Overview</h2>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-value">{stats.totalUsers}</div>
                      <div className="admin-stat-label">Total Students</div>
                    </div>
                    <div className="admin-stat-card success">
                      <div className="admin-stat-value">{stats.totalInternships}</div>
                      <div className="admin-stat-label">Total Internships</div>
                    </div>
                    <div className="admin-stat-card warning">
                      <div className="admin-stat-value">{stats.totalApplications}</div>
                      <div className="admin-stat-label">Total Applications</div>
                    </div>
                    <div className="admin-stat-card info">
                      <div className="admin-stat-value">{stats.totalSelected}</div>
                      <div className="admin-stat-label">Selected</div>
                    </div>
                  </div>

                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Task Statistics</h3>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-value">{stats.totalTasks}</div>
                      <div className="admin-stat-label">Total Tasks</div>
                    </div>
                    <div className="admin-stat-card warning">
                      <div className="admin-stat-value">{stats.pendingTasks}</div>
                      <div className="admin-stat-label">Pending Tasks</div>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERNSHIPS TAB */}
              {activeTab === 'internships' && (
                <div className="admin-section">
                  <h2>Manage Internships ({internships.length})</h2>
                  
                  <div className="create-form-container">
                    <h3>Create New Internship</h3>
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
                    <button className="btn btn-primary" onClick={handleCreateInternship} style={{ marginTop: '1rem' }}>Create Internship</button>
                  </div>

                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Internships</h3>
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
                            <td>{internship.stipend}</td>
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
                  <h2>Review Applications ({filteredApplications.length})</h2>
                  
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by internship title or student name..."
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
                          <th>Evaluation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map(app => {
                          const internship = internships.find(i => i.id === app.internshipId);
                          const user = users.find(u => u.id === app.userId);
                          return (
                            <tr key={app.id}>
                              <td>{user?.fullName || 'Unknown'}</td>
                              <td><strong>{internship?.title || 'N/A'}</strong></td>
                              <td>{formatDate(app.appliedAt)}</td>
                              <td>
                                <select className="status-select" value={app.status} onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}>
                                  <option>Applied</option>
                                  <option>Under Review</option>
                                  <option>Shortlisted</option>
                                  <option>Rejected</option>
                                </select>
                              </td>
                              <td>
                                <span className={`evaluation-badge ${app.evaluation === 'Selected' ? 'selected' : app.evaluation === 'Rejected' ? 'rejected' : 'pending'}`}>
                                  {app.evaluation || 'Pending'}
                                </span>
                              </td>
                              <td>
                                <select className="action-select" onChange={(e) => { if(e.target.value) handleAddFeedback(app.id, 'Evaluation set by admin', e.target.value); e.target.value = ''; }} defaultValue="">
                                  <option value="">Set Evaluation</option>
                                  <option value="Selected">✓ Select</option>
                                  <option value="Rejected">✗ Reject</option>
                                  <option value="Shortlisted">⏳ Shortlist</option>
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

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div className="admin-section">
                  <h2>Manage Tasks ({tasks.length})</h2>
                  
                  <div className="task-form-container">
                    <h4>📝 Assign New Task to Intern</h4>
                    <div className="task-form-grid">
                      <select 
                        value={selectedAppForTask} 
                        onChange={(e) => setSelectedAppForTask(e.target.value)}
                      >
                        <option value="">Select Application *</option>
                        {applications.filter(a => a.status === 'Shortlisted' || a.evaluation === 'Selected').map(app => {
                          const user = users.find(u => u.id === app.userId);
                          const internship = internships.find(i => i.id === app.internshipId);
                          return (
                            <option key={app.id} value={app.id}>
                              {user?.fullName} - {internship?.title}
                            </option>
                          );
                        })}
                      </select>
                      <select 
                        value={newTask.priority} 
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Task Title *" 
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                      <input 
                        type="date" 
                        placeholder="Deadline *"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                      />
                      <textarea 
                        placeholder="Task Description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    <button className="btn btn-primary" onClick={handleAssignTask} style={{ marginTop: '1rem' }}>
                      Assign Task
                    </button>
                    {applications.filter(a => a.status === 'Shortlisted' || a.evaluation === 'Selected').length === 0 && (
                      <p style={{ marginTop: '1rem', color: '#d97706', fontSize: '0.875rem' }}>
                        ⚠️ No shortlisted or selected applications. Shortlist or select an application first to assign tasks.
                      </p>
                    )}
                  </div>

                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Assigned Tasks</h3>
                  
                  {tasks.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
                      <p>No tasks assigned yet. Assign tasks to shortlisted or selected interns above.</p>
                    </div>
                  ) : (
                    <div className="task-list">
                      {tasks.map(task => {
                        const { userName, internshipTitle } = getApplicationDetails(task.applicationId);
                        return (
                          <div key={task.id} className="task-item">
                            <div className="task-item-info">
                              <h5>{task.title}</h5>
                              <p>{task.description || 'No description provided'}</p>
                              <div className="task-item-meta">
                                <span>👤 {userName}</span>
                                <span>💼 {internshipTitle}</span>
                                <span>📅 Due: {formatDate(task.deadline)}</span>
                                <span>🎯 {task.priority} Priority</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span className={`task-status-badge ${task.status === 'Completed' ? 'completed' : 'pending'}`}>
                                {task.status || 'Pending'}
                              </span>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="admin-section">
                  <h2>Manage Users</h2>
                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Students ({users.filter(u => !u.isAdmin).length})</h3>
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>College</th>
                          <th>Branch</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => !u.isAdmin).map(user => (
                          <tr key={user.id}>
                            <td><strong>{user.fullName}</strong></td>
                            <td>{user.email}</td>
                            <td>{user.college}</td>
                            <td>{user.branch}</td>
                            <td>{formatDate(user.createdAt)}</td>
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
