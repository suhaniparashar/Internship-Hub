// ============================================
// LOCAL STORAGE ONLY - NO BACKEND REQUIRED
// ALL DATA IS 100% LOCAL AND DYNAMIC
// ============================================

// Initialize localStorage with default data on first load
const initializeLocalStorage = () => {
  if (!localStorage.getItem('internships')) {
    const defaultInternships = [
      {
        id: Date.now(),
        title: "Frontend Developer Intern",
        company: "TechCorp",
        duration: "3 Months",
        location: "Remote",
        stipend: "₹15,000/month",
        description: "Work on modern web applications using React, Vue, or Angular.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        type: "Full-time",
        applicants: 0,
        deadline: "2025-12-31",
        rating: 4.5,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('internships', JSON.stringify(defaultInternships));
  }

  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: 'user-' + Date.now(),
        username: 'student',
        email: 'student@internhub.com',
        password: 'student123',
        fullName: 'Student User',
        role: 'student',
        isAdmin: false,
        college: 'Your College',
        branch: 'Your Branch',
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-' + Date.now(),
        username: 'admin',
        email: 'admin@internhub.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin',
        isAdmin: true,
        college: 'Admin College',
        branch: 'Admin',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }

  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
  }
};

// Initialize on module load
initializeLocalStorage();

// ============================================
// USER API
// ============================================
export const userAPI = {
  register: (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user exists
        if (users.some(u => u.username === userData.username)) {
          reject(new Error('Username already exists'));
          return;
        }

        const newUser = {
          id: 'user-' + Date.now(),
          ...userData,
          password: userData.password, // Store password (for local use only)
          role: userData.role || 'student',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Return user without password
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  },

  login: (credentials) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(
          u => u.username === credentials.username && u.password === credentials.password
        );

        if (!user) {
          reject(new Error('Invalid credentials'));
          return;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  },

  getAll: () => {
    return new Promise((resolve) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        // Return users without passwords
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        resolve(usersWithoutPasswords);
      } catch {
        resolve([]);
      }
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === id);
        if (!user) {
          reject(new Error('User not found'));
          return;
        }
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id, updateData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        users[userIndex] = { ...users[userIndex], ...updateData };
        localStorage.setItem('users', JSON.stringify(users));
        const { password, ...userWithoutPassword } = users[userIndex];
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// INTERNSHIP API
// ============================================
export const internshipAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        resolve(internships);
      } catch {
        resolve([]);
      }
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        const internship = internships.find(i => i.id == id);
        if (!internship) {
          reject(new Error('Internship not found'));
          return;
        }
        resolve(internship);
      } catch (error) {
        reject(error);
      }
    });
  },

  create: (internshipData) => {
    return new Promise((resolve, reject) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        const newInternship = {
          id: Date.now(),
          ...internshipData,
          applicants: 0,
          createdAt: new Date().toISOString()
        };
        internships.push(newInternship);
        localStorage.setItem('internships', JSON.stringify(internships));
        resolve(newInternship);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id, internshipData) => {
    return new Promise((resolve, reject) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        const index = internships.findIndex(i => i.id == id);
        if (index === -1) {
          reject(new Error('Internship not found'));
          return;
        }
        internships[index] = { ...internships[index], ...internshipData };
        localStorage.setItem('internships', JSON.stringify(internships));
        resolve(internships[index]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const internships = JSON.parse(localStorage.getItem('internships') || '[]');
        const filteredInternships = internships.filter(i => i.id != id);
        localStorage.setItem('internships', JSON.stringify(filteredInternships));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// APPLICATION API
// ============================================
export const applicationAPI = {
  getAll: (userId) => {
    return new Promise((resolve) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        if (userId) {
          const filtered = applications.filter(app => app.userId === userId);
          resolve(filtered);
        } else {
          resolve(applications);
        }
      } catch {
        resolve([]);
      }
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const app = applications.find(a => a.id == id);
        if (!app) {
          reject(new Error('Application not found'));
          return;
        }
        resolve(app);
      } catch (error) {
        reject(error);
      }
    });
  },

  create: (applicationData) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        
        // Check if already applied
        if (applications.some(a => a.userId === applicationData.userId && a.internshipId == applicationData.internshipId)) {
          reject(new Error('Already applied for this internship'));
          return;
        }

        const newApp = {
          id: Date.now(),
          ...applicationData,
          status: 'Pending',
          appliedDate: new Date().toISOString()
        };
        applications.push(newApp);
        localStorage.setItem('applications', JSON.stringify(applications));
        resolve(newApp);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id, updates) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const index = applications.findIndex(a => a.id == id);
        if (index === -1) {
          reject(new Error('Application not found'));
          return;
        }
        applications[index] = { ...applications[index], ...updates };
        localStorage.setItem('applications', JSON.stringify(applications));
        resolve(applications[index]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const filteredApps = applications.filter(a => a.id != id);
        localStorage.setItem('applications', JSON.stringify(filteredApps));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// TASK API
// ============================================
export const taskAPI = {
  getAll: (params = {}) => {
    return new Promise((resolve) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        let filtered = tasks;
        if (params.applicationId) {
          filtered = tasks.filter(t => t.applicationId == params.applicationId);
        }
        resolve(filtered);
      } catch {
        resolve([]);
      }
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const task = tasks.find(t => t.id == id);
        if (!task) {
          reject(new Error('Task not found'));
          return;
        }
        resolve(task);
      } catch (error) {
        reject(error);
      }
    });
  },

  create: (taskData) => {
    return new Promise((resolve, reject) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const newTask = {
          id: Date.now(),
          ...taskData,
          completed: false,
          createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve(newTask);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id, updates) => {
    return new Promise((resolve, reject) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const index = tasks.findIndex(t => t.id == id);
        if (index === -1) {
          reject(new Error('Task not found'));
          return;
        }
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve(tasks[index]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filteredTasks = tasks.filter(t => t.id != id);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

// ============================================
// SUBMISSION API
// ============================================
export const submissionAPI = {
  getAll: (filters = {}) => {
    return new Promise((resolve) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        let filtered = submissions;
        if (filters.userId) {
          filtered = filtered.filter(s => s.userId === filters.userId);
        }
        if (filters.taskId) {
          filtered = filtered.filter(s => s.taskId == filters.taskId);
        }
        resolve(filtered);
      } catch {
        resolve([]);
      }
    });
  },

  create: (submissionData) => {
    return new Promise((resolve, reject) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const newSubmission = {
          id: Date.now(),
          ...submissionData,
          status: 'Pending',
          submittedAt: new Date().toISOString()
        };
        submissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        resolve(newSubmission);
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id, updates) => {
    return new Promise((resolve, reject) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const index = submissions.findIndex(s => s.id == id);
        if (index === -1) {
          reject(new Error('Submission not found'));
          return;
        }
        submissions[index] = { ...submissions[index], ...updates };
        localStorage.setItem('submissions', JSON.stringify(submissions));
        resolve(submissions[index]);
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const filtered = submissions.filter(s => s.id != id);
        localStorage.setItem('submissions', JSON.stringify(filtered));
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default {
  users: userAPI,
  internships: internshipAPI,
  applications: applicationAPI,
  tasks: taskAPI,
  submissions: submissionAPI
};
