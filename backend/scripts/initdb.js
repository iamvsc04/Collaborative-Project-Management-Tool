const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const Event = require("../models/Event");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for seeding..."))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Helper function to create users
const createUsers = async () => {
  try {
    // Delete existing users
    await User.deleteMany({});
    console.log("Deleted existing users");

    // Sample user data
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "admin",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: "password123",
        role: "user",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        password: "password123",
        role: "user",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      {
        name: "Alex Turner",
        email: "alex@example.com",
        password: "password123",
        role: "user",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    ];

    // Hash passwords and create users
    const saltRounds = 10;
    const createdUsers = [];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      createdUsers.push(user);
    }

    console.log(`Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("Error creating users:", error);
    throw error;
  }
};

// Helper function to create projects
const createProjects = async (users) => {
  try {
    // Delete existing projects
    await Project.deleteMany({});
    console.log("Deleted existing projects");

    // Sample project data
    const projects = [
      {
        name: "E-commerce Platform",
        description:
          "Building a responsive e-commerce platform with React and Node.js",
        status: "In Progress",
        priority: "High",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 75,
        leader: users[0]._id,
        team: [users[0]._id, users[1]._id, users[2]._id],
      },
      {
        name: "Mobile App Development",
        description: "Creating a cross-platform mobile app using React Native",
        status: "In Progress",
        priority: "Medium",
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        progress: 45,
        leader: users[1]._id,
        team: [users[1]._id, users[3]._id],
      },
      {
        name: "UI/UX Redesign",
        description:
          "Revamping the user interface and experience of our main product",
        status: "Completed",
        priority: "Medium",
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        progress: 100,
        leader: users[0]._id,
        team: [users[0]._id, users[4]._id],
      },
      {
        name: "Backend API Development",
        description: "Creating RESTful APIs with Express and MongoDB",
        status: "Pending",
        priority: "High",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        progress: 0,
        leader: users[2]._id,
        team: [users[2]._id, users[4]._id],
      },
    ];

    const createdProjects = [];
    for (const projectData of projects) {
      const project = new Project(projectData);
      await project.save();
      createdProjects.push(project);
    }

    console.log(`Created ${createdProjects.length} projects`);
    return createdProjects;
  } catch (error) {
    console.error("Error creating projects:", error);
    throw error;
  }
};

// Helper function to create tasks
const createTasks = async (projects, users) => {
  try {
    // Delete existing tasks
    await Task.deleteMany({});
    console.log("Deleted existing tasks");

    // Sample tasks for each project
    const tasks = [];

    // Generate a hashed password for task access
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("taskpass123", salt);

    // Tasks for E-commerce Platform
    tasks.push(
      {
        title: "Design database schema",
        description: "Create MongoDB schema for products, users, orders",
        status: "Completed",
        priority: "High",
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        project: projects[0]._id,
        assignedTo: users[2]._id,
        createdBy: users[0]._id,
        completedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        leader: users[0]._id,
        accessPassword: hashedPassword,
        accessCode: "ABC123", // This will be overwritten by pre-save hook
        deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        members: [
          {
            user: users[0]._id,
            role: "leader",
            joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          },
          {
            user: users[2]._id,
            role: "member",
            joinedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
          },
        ],
        progress: 100,
      },
      {
        title: "Implement user authentication",
        description:
          "Create login, registration, and password reset functionality",
        status: "Completed",
        priority: "High",
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        project: projects[0]._id,
        assignedTo: users[1]._id,
        createdBy: users[0]._id,
        completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        leader: users[0]._id,
        accessPassword: hashedPassword,
        accessCode: "DEF456", // This will be overwritten by pre-save hook
        deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        members: [
          {
            user: users[0]._id,
            role: "leader",
            joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            user: users[1]._id,
            role: "member",
            joinedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
          },
        ],
        progress: 100,
      },
      {
        title: "Create product listing page",
        description:
          "Implement the main product catalog with filtering and sorting",
        status: "In Progress",
        priority: "Medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        project: projects[0]._id,
        assignedTo: users[0]._id,
        createdBy: users[0]._id,
        leader: users[0]._id,
        accessPassword: hashedPassword,
        accessCode: "GHI789", // This will be overwritten by pre-save hook
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        members: [
          {
            user: users[0]._id,
            role: "leader",
            joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
        ],
        progress: 60,
      }
    );

    // Tasks for Mobile App Development
    tasks.push(
      {
        title: "Setup React Native environment",
        description:
          "Initialize project with React Native CLI and configure dependencies",
        status: "Completed",
        priority: "High",
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        project: projects[1]._id,
        assignedTo: users[1]._id,
        createdBy: users[1]._id,
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        leader: users[1]._id,
        accessPassword: hashedPassword,
        accessCode: "JKL012", // This will be overwritten by pre-save hook
        deadline: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        members: [
          {
            user: users[1]._id,
            role: "leader",
            joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
        ],
        progress: 100,
      },
      {
        title: "Design app wireframes",
        description: "Create wireframes for all app screens in Figma",
        status: "Completed",
        priority: "Medium",
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        project: projects[1]._id,
        assignedTo: users[3]._id,
        createdBy: users[1]._id,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        leader: users[1]._id,
        accessPassword: hashedPassword,
        accessCode: "MNO345", // This will be overwritten by pre-save hook
        deadline: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        members: [
          {
            user: users[1]._id,
            role: "leader",
            joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            user: users[3]._id,
            role: "member",
            joinedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          },
        ],
        progress: 100,
      }
    );

    const createdTasks = [];
    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
      createdTasks.push(task);
    }

    console.log(`Created ${createdTasks.length} tasks`);
    return createdTasks;
  } catch (error) {
    console.error("Error creating tasks:", error);
    throw error;
  }
};

// Helper function to create activities
const createActivities = async (users, projects, tasks) => {
  try {
    // Delete existing activities
    await Activity.deleteMany({});
    console.log("Deleted existing activities");

    const activities = [
      {
        type: "task_completed",
        description: `${users[0].name} completed the Login Page UI development task`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: users[0]._id,
        project: projects[0]._id,
        task: tasks[1]._id,
      },
      {
        type: "new_comment",
        description: `${users[1].name} commented on API Integration document`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        user: users[1]._id,
        project: projects[0]._id,
      },
      {
        type: "deadline_updated",
        description: `${users[2].name} updated the deadline for Database Design`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        user: users[2]._id,
        project: projects[0]._id,
        task: tasks[0]._id,
      },
      {
        type: "user_joined",
        description: `${users[3].name} joined the E-commerce Platform project`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        user: users[3]._id,
        project: projects[0]._id,
      },
      {
        type: "priority_changed",
        description: `${users[4].name} changed the priority of Payment Gateway to High`,
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
        user: users[4]._id,
        project: projects[0]._id,
      },
    ];

    const createdActivities = [];
    for (const activityData of activities) {
      const activity = new Activity(activityData);
      await activity.save();
      createdActivities.push(activity);
    }

    console.log(`Created ${createdActivities.length} activities`);
    return createdActivities;
  } catch (error) {
    console.error("Error creating activities:", error);
    throw error;
  }
};

// Helper function to create events
const createEvents = async (users) => {
  try {
    // Delete existing events
    await Event.deleteMany({});
    console.log("Deleted existing events");

    const events = [
      {
        title: "Weekly Team Meeting",
        description: "Review project progress and discuss blockers",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        time: "10:00 AM - 11:30 AM",
        location: "Conference Room A",
        organizer: users[0]._id,
        attendees: [
          users[0]._id,
          users[1]._id,
          users[2]._id,
          users[3]._id,
          users[4]._id,
        ],
      },
      {
        title: "Project Deadline: UI/UX Redesign",
        description: "Final submission of UI/UX redesign project",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: "All Day",
        organizer: users[0]._id,
        attendees: [users[0]._id, users[4]._id],
      },
      {
        title: "Client Presentation",
        description: "Present the E-commerce Platform progress to the client",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: "2:00 PM - 3:30 PM",
        location: "Virtual - Zoom",
        organizer: users[0]._id,
        attendees: [users[0]._id, users[1]._id, users[2]._id],
      },
    ];

    const createdEvents = [];
    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
      createdEvents.push(event);
    }

    console.log(`Created ${createdEvents.length} events`);
    return createdEvents;
  } catch (error) {
    console.error("Error creating events:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Create users first
    const users = await createUsers();

    // Then create projects
    const projects = await createProjects(users);

    // Create tasks for the projects
    const tasks = await createTasks(projects, users);

    // Create activities
    await createActivities(users, projects, tasks);

    // Create events
    await createEvents(users);

    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Start seeding process
seedDatabase();
