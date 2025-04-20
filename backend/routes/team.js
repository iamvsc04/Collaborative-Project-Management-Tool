const express = require("express");
const { body, validationResult } = require("express-validator");
const Team = require("../models/Team.js");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Get all teams
router.get("/", auth, async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "name email role");
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get team by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "name email role"
    );
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create team
router.post(
  "/",
  [auth, [body("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description } = req.body;

      const team = new Team({
        name,
        description,
        members: [req.user.id], // Add creator as first member
      });

      await team.save();

      // Add team to user's teams
      await User.findByIdAndUpdate(req.user.id, {
        $push: { teams: team._id },
      });

      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Update team
router.put("/:id", auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    let team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if user is a member of the team
    if (!team.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    team = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description } },
      { new: true }
    );

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add member to team
router.put("/:id/members", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if user is a member of the team
    if (!team.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user is already a member
    if (team.members.includes(userId)) {
      return res.status(400).json({ msg: "User is already a member" });
    }

    team.members.push(userId);
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(userId, {
      $push: { teams: team._id },
    });

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Remove member from team
router.delete("/:id/members/:userId", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if user is a member of the team
    if (!team.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Remove user from team
    team.members = team.members.filter(
      (member) => member.toString() !== req.params.userId
    );
    await team.save();

    // Remove team from user's teams
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { teams: team._id },
    });

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete team
router.delete("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if user is a member of the team
    if (!team.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Remove team from all members' teams
    await User.updateMany(
      { _id: { $in: team.members } },
      { $pull: { teams: team._id } }
    );

    await team.remove();
    res.json({ msg: "Team removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
