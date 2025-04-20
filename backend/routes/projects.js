const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
        { "team.members": req.user.id },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get project by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("team", "name")
      .populate("tasks");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if user has access to the project
    if (
      project.owner.toString() !== req.user.id &&
      !project.members.includes(req.user.id) &&
      !project.team?.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Create project
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, teamId } = req.body;

    const project = new Project({
      name,
      description,
      status,
      startDate,
      endDate,
      owner: req.user.id,
      team: teamId,
    });

    await project.save();

    // If team is assigned, add project to team's projects
    if (teamId) {
      const team = await Team.findById(teamId);
      if (team) {
        team.projects.push(project._id);
        await team.save();
      }
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, teamId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if user is owner or member
    if (
      project.owner.toString() !== req.user.id &&
      !project.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, status, startDate, endDate, team: teamId } },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });

    await project.remove();

    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
