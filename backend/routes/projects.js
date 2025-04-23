const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get project by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has access to the project
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(member => member._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this project",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, deadline, members } = req.body;

    // Create new project with the current user as owner
    const project = new Project({
      title,
      description,
      deadline,
      owner: req.user.id,
      members: [req.user.id, ...(members || [])], // Add owner and any additional members
    });

    await project.save();

    // Populate the owner and members before sending response
    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, deadline, members } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    const updateData = {
      title,
      description,
      status,
      deadline,
      members: members ? [...new Set([req.user.id, ...members])] : undefined,
    };

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await project.remove();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Join project
router.post("/:id/join", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is already a member
    if (project.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this project",
      });
    }

    // Add user to members array
    project.members.push(req.user.id);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    console.error("Join project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get user's projects
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.params.userId }, { members: req.params.userId }],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get user projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
