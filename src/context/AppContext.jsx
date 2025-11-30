import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { userAPI, internshipAPI, applicationAPI, taskAPI, submissionAPI } from '../api/index.js';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser', null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [internshipsData, usersData, tasksData, submissionsData] = await Promise.all([
        internshipAPI.getAll(),
        userAPI.getAllUsers(),
        taskAPI.getAll(),
        submissionAPI.getAll()
      ]);

      setInternships(internshipsData || []);
      setUsers(usersData || []);
      setTasks(tasksData || []);
      setSubmissions(submissionsData || []);

      if (loggedInUser) {
        const userApps = await applicationAPI.getByUserId(loggedInUser.id);
        setApplications(userApps || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Pure local storage login
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userData = users.find(u =>
        (u.username.toLowerCase() === username.toLowerCase() ||
         u.email.toLowerCase() === username.toLowerCase()) &&
        u.password === password
      );
      if (!userData) {
        return { success: false, error: 'Invalid credentials' };
      }
      setLoggedInUser(userData);
      // Optionally fetch applications if needed
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    setLoggedInUser(null);
    setApplications([]);
  };

  const register = async (newUser) => {
    try {
      const userData = await userAPI.register(newUser);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const applyForInternship = async (internshipId) => {
    if (!loggedInUser) return false;
    
    try {
      const applicationData = {
        userId: loggedInUser.id,
        internshipId: internshipId
      };
      
      const newApplication = await applicationAPI.create(applicationData);
      setApplications([...applications, newApplication]);
      return true;
    } catch (error) {
      console.error('Apply error:', error.message);
      return false;
    }
  };

  const getUserApplications = () => {
    if (!loggedInUser) return [];
    return applications.filter(app => app.userId === loggedInUser.id);
  };

  const hasApplied = (internshipId) => {
    if (!loggedInUser) return false;
    return applications.some(
      app => app.userId === loggedInUser.id && app.internshipId == internshipId
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const updatedApp = await applicationAPI.updateStatus(applicationId, newStatus);
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

  const addTaskToApplication = async (applicationId, taskData) => {
    try {
      const newTask = await taskAPI.create({
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

  const updateTaskStatus = async (taskId, completed) => {
    try {
      const updatedTask = await taskAPI.update(taskId, { completed });
      const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Update task error:', error);
      return false;
    }
  };

  const addTaskFeedback = async (taskId, feedback) => {
    try {
      const updatedTask = await taskAPI.update(taskId, { adminFeedback: feedback });
      const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Add feedback error:', error);
      return false;
    }
  };

  const addAdminFeedback = async (applicationId, feedback) => {
    try {
      const updatedApp = await applicationAPI.addFeedback(applicationId, feedback);
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

  const deleteTask = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Delete task error:', error);
      return false;
    }
  };

  const createSubmission = async (submissionData) => {
    try {
      const newSubmission = await submissionAPI.create(submissionData);
      setSubmissions([...submissions, newSubmission]);
      return true;
    } catch (error) {
      console.error('Create submission error:', error);
      return false;
    }
  };

  // Admin functions
  const createInternship = async (internshipData) => {
    try {
      const newInternship = await internshipAPI.create(internshipData);
      setInternships([...internships, newInternship]);
      return { success: true, internship: newInternship };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateInternship = async (internshipId, updates) => {
    try {
      const updated = await internshipAPI.update(internshipId, updates);
      const updatedList = internships.map(i => i.id === internshipId ? updated : i);
      setInternships(updatedList);
      return { success: true, internship: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteInternship = async (internshipId) => {
    try {
      await internshipAPI.delete(internshipId);
      const updatedList = internships.filter(i => i.id !== internshipId);
      setInternships(updatedList);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const updated = await userAPI.updateUser(userId, updates);
      const updatedList = users.map(u => u.id === userId ? updated : u);
      setUsers(updatedList);
      if (loggedInUser.id === userId) {
        setLoggedInUser(updated);
      }
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      const updatedList = users.filter(u => u.id !== userId);
      setUsers(updatedList);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    loggedInUser,
    users,
    internships,
    applications,
    tasks,
    submissions,
    darkMode,
    isLoading,
    login,
    logout,
    register,
    applyForInternship,
    getUserApplications,
    hasApplied,
    toggleDarkMode,
    updateApplicationStatus,
    addTaskToApplication,
    updateTaskStatus,
    addTaskFeedback,
    addAdminFeedback,
    deleteTask,
    createSubmission,
    fetchAllData,
    createInternship,
    updateInternship,
    deleteInternship,
    updateUser,
    deleteUser,
    // Expose raw API objects for Admin page
    applicationAPI,
    internshipAPI,
    userAPI
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
