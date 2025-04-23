const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const Event = require("../models/Event");

// @route   GET /api/dashboard
// @desc    Get dashboard data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // Get user information
    const userId = req.user.id;

    // Get total projects count
    const totalProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
    });

    // Get team members count for projects user is part of
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    });
    const projectIds = userProjects.map((project) => project._id);

    // Use aggregation to get unique team members across all user's projects
    const teamMembers = await Project.aggregate([
      { $match: { _id: { $in: projectIds } } },
      { $unwind: "$members" },
      { $group: { _id: "$members" } },
      { $count: "total" },
    ]);
    const totalTeamMembers = teamMembers.length > 0 ? teamMembers[0].total : 0;

    // Get active projects count
    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: "In Progress",
    });

    // Get completed tasks count
    const completedTasks = await Task.countDocuments({
      $or: [{ assignedTo: userId }, { createdBy: userId }],
      status: "Completed",
    });

    // Get recent projects
    const recentProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("owner", "name email")
      .populate("members", "name email");

    // Format project data for the frontend
    const formattedProjects = recentProjects.map((project) => ({
      id: project._id,
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      owner: {
        id: project.owner._id,
        name: project.owner.name,
        email: project.owner.email,
      },
      members: project.members.map((member) => ({
        id: member._id,
        name: member.name,
        email: member.email,
      })),
    }));

    // Get recent activities
    const recentActivities = await Activity.find({
      $or: [{ user: userId }, { project: { $in: projectIds } }],
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("user", "name email");

    // Format activities data for the frontend
    const formattedActivities = recentActivities.map((activity) => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      user: {
        id: activity.user._id,
        name: activity.user.name,
        email: activity.user.email,
      },
    }));

    // Get upcoming events
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingEvents = await Event.find({
      date: { $gte: today, $lte: thirtyDaysFromNow },
      $or: [{ organizer: userId }, { attendees: userId }],
    })
      .sort({ date: 1 })
      .limit(5);

    // Format events data for the frontend
    const formattedEvents = upcomingEvents.map((event) => ({
      id: event._id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
    }));

    // Compile dashboard data
    const dashboardData = {
      stats: {
        totalProjects,
        totalTeamMembers,
        activeProjects,
        completedTasks,
      },
      recentProjects: formattedProjects,
      recentActivities: formattedActivities,
      upcomingEvents: formattedEvents,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
