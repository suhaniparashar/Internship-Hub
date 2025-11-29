import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api/index.js';

// Create Context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

// Context Provider Component
export const AppContextProvider = ({ children }) => {
  // State management - all local storage based
  const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser', null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Fetch all data from localStorage
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [internshipsData, usersData, applicationsData, tasksData, submissionsData] = await Promise.all([
        api.internships.getAll(),
        api.users.getAll(),
        loggedInUser ? api.applications.getAll(loggedInUser.id) : Promise.resolve([]),
        api.tasks.getAll(),
        api.submissions.getAll()
      ]);

      setInternships(internshipsData || []);
      setUsers(usersData || []);
      setApplications(applicationsData || []);
      setTasks(tasksData || []);
      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - local storage only
  const login = async (username, password) => {
    try {
      const userData = await api.users.login({ username, password });
      setLoggedInUser(userData);
      
      // Fetch user's applications after login
      const userApps = await api.applications.getAll(userData.id);
      setApplications(userApps);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  // Logout function
  const logout = () => {
    setLoggedInUser(null);
    setApplications([]);
  };

  // Register new user
  const register = async (newUser) => {
    try {
      const userData = await api.users.register(newUser);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Apply for internship
  const applyForInternship = async (internshipId) => {
    if (!loggedInUser) return false;
    
    try {
      const applicationData = {
        userId: loggedInUser.id,
        internshipId: internshipId
      };
      
      const newApplication = await api.applications.create(applicationData);
      setApplications([...applications, newApplication]);
      return true;
    } catch (error) {
      console.error('Apply error:', error.message);
      return false;
    }
  };

  // Get user applications
  const getUserApplications = () => {
    if (!loggedInUser) return [];
    return applications.filter(app => app.userId === loggedInUser.id);
  };

  // Check if user has applied for an internship
  const hasApplied = (internshipId) => {
    if (!loggedInUser) return false;
    return applications.some(
      app => app.userId === loggedInUser.id && app.internshipId == internshipId
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const updatedApp = await api.applications.update(applicationId, { status: newStatus });
      const updatedApplications = applications.map(app =>
        app.id === applicationId ? updatedApp : app
      );
      setApplications(updatedApplications);
      return true;
    } catch (error) {
      console.error('Update status error:', error);
      return false;
    }
  };

  // Delete application
  const deleteApplication = async (applicationId) => {
    try {
      await api.applications.delete(applicationId);
      const updatedApplications = applications.filter(app => app.id !== applicationId);
      setApplications(updatedApplications);
      return true;
    } catch (error) {
      console.error('Delete application error:', error);
      return false;
    }
  };

  // Create task
  const addTaskToApplication = async (applicationId, taskData) => {
    try {
      const newTask = await api.tasks.create({
        applicationId: applicationId,
        userId: loggedInUser.id,
        ...taskData,
        completed: false
      });
      setTasks([...tasks, newTask]);
      return true;
    } catch (error) {
      console.error('Add task error:', error);
      return false;
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, completed) => {
    try {
      const updatedTask = await api.tasks.update(taskId, { completed });
      const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Update task error:', error);
      return false;
    }
  };

  // Add task feedback
  const addTaskFeedback = async (taskId, feedback) => {
    try {
      const updatedTask = await api.tasks.update(taskId, { adminFeedback: feedback });
      const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Add feedback error:', error);
      return false;
    }
  };

  // Add admin feedback to application
  const addAdminFeedback = async (applicationId, feedback) => {
    try {
      const updatedApp = await api.applications.update(applicationId, { adminFeedback: feedback });
      const updatedApplications = applications.map(app =>
        app.id === applicationId ? updatedApp : app
      );
      setApplications(updatedApplications);
      return true;
    } catch (error) {
      console.error('Add feedback error:', error);
      return false;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await api.tasks.delete(taskId);
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Delete task error:', error);
      return false;
    }
  };

  // Create submission
  const createSubmission = async (submissionData) => {
    try {
      const newSubmission = await api.submissions.create(submissionData);
      setSubmissions([...submissions, newSubmission]);
      return true;
    } catch (error) {
      console.error('Create submission error:', error);
      return false;
    }
  };

  // Update submission
  const updateSubmission = async (submissionId, updates) => {
    try {
      const updatedSubmission = await api.submissions.update(submissionId, updates);
      const updatedSubmissions = submissions.map(s => s.id === submissionId ? updatedSubmission : s);
      setSubmissions(updatedSubmissions);
      return true;
    } catch (error) {
      console.error('Update submission error:', error);
      return false;
    }
  };

  // Context value
  const value = {
    // State
    loggedInUser,
    users,
    internships,
    applications,
    tasks,
    submissions,
    darkMode,
    isLoading,
    
    // Functions
    login,
    logout,
    register,
    applyForInternship,
    getUserApplications,
    hasApplied,
    toggleDarkMode,
    updateApplicationStatus,
    deleteApplication,
    addTaskToApplication,
    updateTaskStatus,
    addTaskFeedback,
    addAdminFeedback,
    deleteTask,
    createSubmission,
    updateSubmission,
    fetchAllData // Export for manual refresh
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
