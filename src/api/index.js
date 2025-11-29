const API_URL = 'http://localhost:5000/api';
const API_TIMEOUT = 5000; // 5 second timeout

// Helper function for API calls with timeout
const apiCall = async (endpoint, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('API call timeout - switching to offline mode');
      throw new Error('Connection timeout - using offline mode');
    }
    console.error('API Error:', error);
    throw error;
  }
};

// User API
export const userAPI = {
  register: (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getAll: () => apiCall('/users'),

  getById: (id) => apiCall(`/users/${id}`),
};

// Internship API
export const internshipAPI = {
  getAll: () => apiCall('/internships'),

  getById: (id) => apiCall(`/internships/${id}`),

  create: (internshipData) => apiCall('/internships', {
    method: 'POST',
    body: JSON.stringify(internshipData),
  }),

  update: (id, internshipData) => apiCall(`/internships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(internshipData),
  }),

  delete: (id) => apiCall(`/internships/${id}`, {
    method: 'DELETE',
  }),
};

// Application API
export const applicationAPI = {
  getAll: (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiCall(`/applications${query}`);
  },

  getById: (id) => apiCall(`/applications/${id}`),

  create: (applicationData) => apiCall('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),

  update: (id, updates) => apiCall(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  delete: (id) => apiCall(`/applications/${id}`, {
    method: 'DELETE',
  }),
};

// Task API
export const taskAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/tasks${query ? `?${query}` : ''}`);
  },

  getById: (id) => apiCall(`/tasks/${id}`),

  create: (taskData) => apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),

  update: (id, updates) => apiCall(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  delete: (id) => apiCall(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  users: userAPI,
  internships: internshipAPI,
  applications: applicationAPI,
  tasks: taskAPI,
};
