import { Grid, Box, Typography, Paper } from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Task as TaskIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import CustomCard from "../common/CustomCard";

const StatCard = ({ title, value, icon, trend, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: "100%",
      backgroundColor: `${color}.lighter`,
      borderRadius: 4,
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          color={`${color}.darker`}
          gutterBottom
        >
          {value}
        </Typography>
        <Typography variant="body2" color={`${color}.darker`}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          backgroundColor: `${color}.main`,
          color: "white",
        }}
      >
        {icon}
      </Box>
    </Box>
    {trend && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 2,
          color: trend > 0 ? "success.main" : "error.main",
        }}
      >
        <TrendingUpIcon
          fontSize="small"
          sx={{
            mr: 0.5,
            transform: trend < 0 ? "rotate(180deg)" : "none",
          }}
        />
        <Typography variant="body2" fontWeight={500}>
          {trend > 0 ? "+" : ""}
          {trend}% from last month
        </Typography>
      </Box>
    )}
  </Paper>
);

const DashboardOverview = () => {
  const projects = [
    {
      title: "Website Redesign",
      subtitle: "Marketing Campaign",
      progress: 75,
      status: "In Progress",
      dueDate: "Due in 3 days",
      members: [
        { name: "John Doe", avatar: "/avatars/1.jpg" },
        { name: "Jane Smith", avatar: "/avatars/2.jpg" },
      ],
      tags: ["Design", "Frontend"],
    },
    {
      title: "Mobile App Development",
      subtitle: "E-commerce Project",
      progress: 45,
      status: "In Progress",
      dueDate: "Due in 1 week",
      members: [
        { name: "Alice Johnson", avatar: "/avatars/3.jpg" },
        { name: "Bob Wilson", avatar: "/avatars/4.jpg" },
      ],
      tags: ["React Native", "API"],
    },
    {
      title: "Database Migration",
      subtitle: "Infrastructure Update",
      progress: 90,
      status: "Completed",
      dueDate: "Completed",
      members: [{ name: "Charlie Brown", avatar: "/avatars/5.jpg" }],
      tags: ["Database", "Backend"],
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome back! Here's what's happening with your projects.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value="12"
            icon={<TaskIcon />}
            trend={8}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Members"
            value="24"
            icon={<GroupIcon />}
            trend={12}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasks Completed"
            value="156"
            icon={<TaskIcon />}
            trend={-3}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Hours Logged"
            value="284"
            icon={<AccessTimeIcon />}
            trend={15}
            color="info"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Active Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CustomCard {...project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
