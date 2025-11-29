import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Application from '../models/Application.js';
import Submission from '../models/Submission.js';
import Internship from '../models/Internship.js';

const router = express.Router();

// Middleware to verify admin role
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET: All users with stats
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const applications = await Application.countDocuments({ userId: user._id });
        const tasks = await Task.countDocuments({ userId: user._id });
        const completedTasks = await Task.countDocuments({ userId: user._id, completed: true });
        const submissions = await Submission.countDocuments({ userId: user._id });
        
        return {
          ...user.toObject(),
          stats: {
            applications,
            tasks,
            completedTasks,
            taskCompletionRate: tasks > 0 ? ((completedTasks / tasks) * 100).toFixed(2) : 0,
            submissions,
            activeSubmissions: await Submission.countDocuments({ userId: user._id, status: 'pending' })
          }
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// GET: Single user with full profile
router.get('/users/:userId', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const applications = await Application.find({ userId: user._id }).populate('internshipId');
    const tasks = await Task.find({ userId: user._id });
    const submissions = await Submission.find({ userId: user._id }).populate('taskId');
    const activityLogs = applications.concat(tasks).sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      user: user.toObject(),
      applications,
      tasks,
      submissions,
      recentActivity: activityLogs.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

// PUT: Update user status (active/inactive/kicked)
router.put('/users/:userId/status', adminOnly, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!['active', 'inactive', 'kicked'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    ).select('-password');

    // Log the action
    console.log(`[ADMIN ACTION] User ${user.username} status changed to ${status}. Reason: ${reason || 'None'}`);

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
});

// DELETE: Kick user from specific internship
router.delete('/users/:userId/internship/:internshipId', adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await Application.findOneAndDelete({
      userId: req.params.userId,
      internshipId: req.params.internshipId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Delete related tasks
    await Task.deleteMany({ applicationId: application._id });

    // Delete related submissions
    await Submission.deleteMany({ 
      userId: req.params.userId,
      taskId: { $in: await Task.find({ applicationId: application._id }) }
    });

    console.log(`[ADMIN ACTION] User kicked from internship. Reason: ${reason || 'None'}`);

    res.json({ message: 'User removed from internship', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove user', error: error.message });
  }
});

// PUT: Assign task to user
router.post('/tasks/assign', adminOnly, async (req, res) => {
  try {
    const { userId, applicationId, title, deadline } = req.body;

    const task = new Task({
      userId,
      applicationId,
      title,
      completed: false,
      deadline: deadline ? new Date(deadline) : null
    });

    await task.save();

    console.log(`[ADMIN ACTION] Task "${title}" assigned to user ${userId}`);

    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign task', error: error.message });
  }
});

// GET: All submissions with filters
router.get('/submissions', adminOnly, async (req, res) => {
  try {
    const { status, userId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const submissions = await Submission.find(filter)
      .populate('userId', 'username email fullName')
      .populate('taskId', 'title applicationId')
      .populate('reviewedBy', 'username fullName');

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
});

// GET: Single submission details
router.get('/submissions/:submissionId', adminOnly, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('userId', 'username email fullName college')
      .populate('taskId', 'title applicationId')
      .populate('reviewedBy', 'username fullName');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
});

// PUT: Review submission (approve/reject)
router.put('/submissions/:submissionId/review', adminOnly, async (req, res) => {
  try {
    const { status, feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      {
        status,
        adminFeedback: feedback,
        reviewedAt: new Date(),
        reviewedBy: req.userId
      },
      { new: true }
    ).populate('userId', 'username email');

    // Update task if approved
    if (status === 'approved' && submission.taskId) {
      await Task.findByIdAndUpdate(submission.taskId, { completed: true });
    }

    console.log(`[ADMIN ACTION] Submission reviewed: ${status}. Feedback: ${feedback}`);

    res.json({ message: `Submission ${status}`, submission });
  } catch (error) {
    res.status(500).json({ message: 'Failed to review submission', error: error.message });
  }
});

// GET: User activity progress
router.get('/progress/:userId', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const applications = await Application.find({ userId: req.params.userId });
    const tasks = await Task.find({ userId: req.params.userId });
    const submissions = await Submission.find({ userId: req.params.userId });
    const approvedSubmissions = submissions.filter(s => s.status === 'approved');

    const progress = {
      userId: req.params.userId,
      userName: user.fullName,
      lastActive: user.lastActive,
      profileProgress: user.profileProgress,
      stats: {
        totalApplications: applications.length,
        activeApplications: applications.filter(a => a.status === 'pending').length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length,
        taskCompletionRate: tasks.length > 0 ? ((tasks.filter(t => t.completed).length / tasks.length) * 100).toFixed(2) : 0,
        totalSubmissions: submissions.length,
        approvedSubmissions: approvedSubmissions.length,
        pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
        rejectedSubmissions: submissions.filter(s => s.status === 'rejected').length,
        submissionApprovalRate: submissions.length > 0 ? ((approvedSubmissions.length / submissions.length) * 100).toFixed(2) : 0
      },
      recentApplications: applications.slice(-5),
      recentTasks: tasks.slice(-5),
      recentSubmissions: submissions.slice(-5)
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }
});

// GET: Dashboard analytics
router.get('/analytics/overview', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const kickedUsers = await User.countDocuments({ status: 'kicked' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    
    const totalSubmissions = await Submission.countDocuments();
    const approvedSubmissions = await Submission.countDocuments({ status: 'approved' });
    const pendingSubmissions = await Submission.countDocuments({ status: 'pending' });
    const rejectedSubmissions = await Submission.countDocuments({ status: 'rejected' });
    
    const totalInternships = await Internship.countDocuments();

    const analytics = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        kicked: kickedUsers,
        admins
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
        acceptanceRate: totalApplications > 0 ? ((acceptedApplications / totalApplications) * 100).toFixed(2) : 0
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
      },
      submissions: {
        total: totalSubmissions,
        approved: approvedSubmissions,
        pending: pendingSubmissions,
        rejected: rejectedSubmissions,
        approvalRate: totalSubmissions > 0 ? ((approvedSubmissions / totalSubmissions) * 100).toFixed(2) : 0
      },
      internships: {
        total: totalInternships
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// GET: User activity timeline
router.get('/activity/:userId', adminOnly, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('internshipId', 'company role')
      .sort('-createdAt');
    
    const tasks = await Task.find({ userId: req.params.userId })
      .sort('-createdAt');
    
    const submissions = await Submission.find({ userId: req.params.userId })
      .sort('-submittedAt');

    const timeline = [
      ...applications.map(app => ({
        type: 'application',
        action: `Applied for ${app.internshipId?.company} - ${app.internshipId?.role}`,
        status: app.status,
        timestamp: app.createdAt
      })),
      ...tasks.map(task => ({
        type: 'task',
        action: `Task assigned: ${task.title}`,
        status: task.completed ? 'completed' : 'pending',
        timestamp: task.createdAt
      })),
      ...submissions.map(sub => ({
        type: 'submission',
        action: `File submitted: ${sub.fileName}`,
        status: sub.status,
        timestamp: sub.submittedAt
      }))
    ].sort((a, b) => b.timestamp - a.timestamp);

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity', error: error.message });
  }
});

export default router;
