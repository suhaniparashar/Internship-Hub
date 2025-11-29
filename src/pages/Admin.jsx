import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [taskForm, setTaskForm] = useState({ title: '', deadline: '', userId: '', applicationId: '' });
  const [reviewForm, setReviewForm] = useState({ status: 'pending', feedback: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const apiBase = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'overview') fetchAnalytics();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'submissions') fetchSubmissions();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/admin/analytics/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/admin/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (userId) => {
    try {
      const res = await fetch(`${apiBase}/admin/progress/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUserProgress(data);
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserProgress(user._id);
  };

  const updateUserStatus = async (userId, status, reason = '') => {
    try {
      const res = await fetch(`${apiBase}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });

      if (res.ok) {
        alert(`✅ User status updated to ${status}`);
        fetchUsers();
      } else {
        alert('❌ Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const kickUserFromInternship = async (userId, internshipId) => {
    const reason = prompt('Enter reason for removal:');
    if (!reason) return;

    try {
      const res = await fetch(`${apiBase}/admin/users/${userId}/internship/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (res.ok) {
        alert('✅ User removed from internship');
        fetchUserProgress(userId);
      } else {
        alert('❌ Failed to remove user');
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/admin/tasks/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskForm)
      });

      if (res.ok) {
        alert('✅ Task assigned successfully');
        setTaskForm({ title: '', deadline: '', userId: '', applicationId: '' });
        fetchUsers();
      } else {
        alert('❌ Failed to assign task');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const reviewSubmission = async (submissionId) => {
    try {
      const res = await fetch(`${apiBase}/admin/submissions/${submissionId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      if (res.ok) {
        alert(`✅ Submission ${reviewForm.status}`);
        setShowReviewModal(false);
        setReviewForm({ status: 'pending', feedback: '' });
        fetchSubmissions();
      } else {
        alert('❌ Failed to review submission');
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (filterStatus !== 'all' && user.status !== filterStatus) return false;
      if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'applications') return (b.stats?.applications || 0) - (a.stats?.applications || 0);
      if (sortBy === 'recent') return new Date(b.lastActive) - new Date(a.lastActive);
      return 0;
    });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Admin Control Panel</h1>
        <p>Manage users, tasks, submissions, and monitor platform activity</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</button>
        <button className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>📁 Submissions</button>
        <button className={`admin-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>✅ Assign Tasks</button>
      </div>

      {loading && <div className="loading">⏳ Loading...</div>}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && analytics && (
        <div className="admin-section">
          <h2>Platform Overview</h2>
          
          <div className="stats-grid">
            <div className="stat-box primary">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{analytics.users.total}</div>
                <div className="stat-breakdown">
                  Active: {analytics.users.active} | Inactive: {analytics.users.inactive} | Kicked: {analytics.users.kicked}
                </div>
              </div>
            </div>

            <div className="stat-box success">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-label">Applications</div>
                <div className="stat-value">{analytics.applications.total}</div>
                <div className="stat-breakdown">
                  Acceptance Rate: {analytics.applications.acceptanceRate}%
                </div>
              </div>
            </div>

            <div className="stat-box warning">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-label">Tasks</div>
                <div className="stat-value">{analytics.tasks.total}</div>
                <div className="stat-breakdown">
                  Completion Rate: {analytics.tasks.completionRate}%
                </div>
              </div>
            </div>

            <div className="stat-box info">
              <div className="stat-icon">📤</div>
              <div className="stat-content">
                <div className="stat-label">Submissions</div>
                <div className="stat-value">{analytics.submissions.total}</div>
                <div className="stat-breakdown">
                  Approval Rate: {analytics.submissions.approvalRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="detailed-stats">
            <div className="stat-section">
              <h3>User Status Breakdown</h3>
              <ul>
                <li><span>🟢 Active</span><span>{analytics.users.active}</span></li>
                <li><span>🟡 Inactive</span><span>{analytics.users.inactive}</span></li>
                <li><span>🔴 Kicked</span><span>{analytics.users.kicked}</span></li>
                <li><span>⭐ Admins</span><span>{analytics.users.admins}</span></li>
              </ul>
            </div>

            <div className="stat-section">
              <h3>Application Status</h3>
              <ul>
                <li><span>⏳ Pending</span><span>{analytics.applications.pending}</span></li>
                <li><span>✅ Accepted</span><span>{analytics.applications.accepted}</span></li>
                <li><span>❌ Rejected</span><span>{analytics.applications.rejected}</span></li>
              </ul>
            </div>

            <div className="stat-section">
              <h3>Task Status</h3>
              <ul>
                <li><span>✅ Completed</span><span>{analytics.tasks.completed}</span></li>
                <li><span>⏳ Pending</span><span>{analytics.tasks.pending}</span></li>
              </ul>
            </div>

            <div className="stat-section">
              <h3>Submission Status</h3>
              <ul>
                <li><span>✅ Approved</span><span>{analytics.submissions.approved}</span></li>
                <li><span>⏳ Pending</span><span>{analytics.submissions.pending}</span></li>
                <li><span>❌ Rejected</span><span>{analytics.submissions.rejected}</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management</h2>

          <div className="user-controls">
            <input
              type="text"
              placeholder="🔍 Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏳ Inactive</option>
              <option value="kicked">❌ Kicked</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name">Sort by Name</option>
              <option value="applications">Sort by Applications</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>

          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user._id} className="user-card" onClick={() => handleUserSelect(user)}>
                <div className="user-header">
                  <h3>{user.fullName}</h3>
                  <span className={`status-badge ${user.status}`}>{user.status.toUpperCase()}</span>
                </div>
                <p className="user-email">{user.email}</p>
                <div className="user-stats">
                  <span>📝 Apps: {user.stats?.applications || 0}</span>
                  <span>✅ Tasks: {user.stats?.tasks || 0}</span>
                  <span>📤 Subs: {user.stats?.submissions || 0}</span>
                </div>
                <div className="user-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${user.stats?.taskCompletionRate || 0}%` }}></div>
                  </div>
                  <p>{user.stats?.taskCompletionRate || 0}% task completion</p>
                </div>
                <div className="user-actions">
                  <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); updateUserStatus(user._id, 'active'); }}>Activate</button>
                  <button className="action-btn warning" onClick={(e) => { e.stopPropagation(); updateUserStatus(user._id, 'inactive', 'Admin deactivation'); }}>Deactivate</button>
                  <button className="action-btn danger" onClick={(e) => { e.stopPropagation(); updateUserStatus(user._id, 'kicked', 'Removed by admin'); }}>Kick</button>
                </div>
              </div>
            ))}
          </div>

          {/* User Details Panel */}
          {selectedUser && userProgress && (
            <div className="user-details-panel">
              <h3>📊 {selectedUser.fullName}'s Profile</h3>

              <div className="details-header">
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>College:</label>
                  <span>{selectedUser.college || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Branch:</label>
                  <span>{selectedUser.branch || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Last Active:</label>
                  <span>{new Date(selectedUser.lastActive).toLocaleString()}</span>
                </div>
              </div>

              <div className="progress-details">
                <h4>Progress & Statistics</h4>
                <div className="progress-grid">
                  <div className="progress-item">
                    <label>Profile Completion</label>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${userProgress.profileProgress}%` }}></div>
                    </div>
                    <span>{userProgress.profileProgress}%</span>
                  </div>

                  <div className="progress-item">
                    <label>Task Completion</label>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${userProgress.stats.taskCompletionRate}%` }}></div>
                    </div>
                    <span>{userProgress.stats.taskCompletionRate}%</span>
                  </div>

                  <div className="progress-item">
                    <label>Submission Approval</label>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${userProgress.stats.submissionApprovalRate}%` }}></div>
                    </div>
                    <span>{userProgress.stats.submissionApprovalRate}%</span>
                  </div>

                  <div className="progress-item">
                    <label>Application Acceptance</label>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${userProgress.stats.acceptedApplications > 0 ? (userProgress.stats.acceptedApplications / userProgress.stats.totalApplications * 100) : 0}%` }}></div>
                    </div>
                    <span>{userProgress.stats.acceptedApplications}/{userProgress.stats.totalApplications}</span>
                  </div>
                </div>
              </div>

              <div className="applications-section">
                <h4>Recent Applications</h4>
                {userProgress.recentApplications.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProgress.recentApplications.map(app => (
                        <tr key={app._id}>
                          <td>{app.company}</td>
                          <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                          <td>
                            <button className="action-btn danger small" onClick={() => kickUserFromInternship(selectedUser._id, app._id)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No applications yet</p>
                )}
              </div>

              <div className="tasks-section">
                <h4>Assigned Tasks: {userProgress.stats.totalTasks}</h4>
                {userProgress.recentTasks.length > 0 ? (
                  <ul>
                    {userProgress.recentTasks.map(task => (
                      <li key={task._id}>
                        <span className={task.completed ? 'completed' : 'pending'}>{task.title}</span>
                        <span className="task-status">{task.completed ? '✅ Completed' : '⏳ Pending'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks assigned</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="admin-section">
          <h2>File Submissions Review</h2>

          <div className="submissions-list">
            {submissions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub._id}>
                      <td>{sub.userId?.fullName}</td>
                      <td>{sub.fileName}</td>
                      <td><span className="badge badge-info">{sub.fileType}</span></td>
                      <td>{(sub.fileSize / 1024).toFixed(2)} KB</td>
                      <td><span className={`status-badge ${sub.status}`}>{sub.status}</span></td>
                      <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-btn primary small"
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setShowReviewModal(true);
                            setReviewForm({ status: 'pending', feedback: '' });
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No submissions yet</p>
            )}
          </div>

          {showReviewModal && selectedSubmission && (
            <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Review Submission: {selectedSubmission.fileName}</h3>
                <div className="submission-details">
                  <p><strong>User:</strong> {selectedSubmission.userId?.fullName}</p>
                  <p><strong>Email:</strong> {selectedSubmission.userId?.email}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  <p><strong>File Size:</strong> {(selectedSubmission.fileSize / 1024).toFixed(2)} KB</p>
                </div>

                <div className="review-form">
                  <div className="form-group">
                    <label>Decision:</label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="approved">✅ Approved</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Feedback:</label>
                    <textarea
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      placeholder="Enter feedback for the user..."
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="modal-actions">
                    <button className="action-btn primary" onClick={() => reviewSubmission(selectedSubmission._id)}>Submit Review</button>
                    <button className="action-btn secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="admin-section">
          <h2>Assign New Task</h2>

          <form className="task-form" onSubmit={assignTask}>
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="text"
                placeholder="Enter user ID"
                value={taskForm.userId}
                onChange={(e) => setTaskForm({ ...taskForm, userId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Application ID:</label>
              <input
                type="text"
                placeholder="Enter application ID"
                value={taskForm.applicationId}
                onChange={(e) => setTaskForm({ ...taskForm, applicationId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Task Title:</label>
              <input
                type="text"
                placeholder="e.g., Submit Resume, Interview Prep"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Deadline:</label>
              <input
                type="datetime-local"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
              />
            </div>

            <button type="submit" className="action-btn primary">✅ Assign Task</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
