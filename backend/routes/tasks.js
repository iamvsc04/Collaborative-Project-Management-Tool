const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// Get all tasks for a project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get task by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.project);
    if (
      project.owner.toString() !== req.user.id &&
      !project.members.includes(req.user.id) &&
      !project.team?.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
    } = req.body;

    // Check if project exists and user has access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (
      projectDoc.owner.toString() !== req.user.id &&
      !projectDoc.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user.id,
    });

    await task.save();

    // Add task to project's tasks array
    projectDoc.tasks.push(task._id);
    await projectDoc.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.project);
    if (
      project.owner.toString() !== req.user.id &&
      !project.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, status, priority, dueDate, assignedTo } },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.project);
    if (
      project.owner.toString() !== req.user.id &&
      !project.members.includes(req.user.id)
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Remove task from project's tasks array
    project.tasks = project.tasks.filter(
      (taskId) => taskId.toString() !== req.params.id
    );
    await project.save();

    await task.remove();

    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
