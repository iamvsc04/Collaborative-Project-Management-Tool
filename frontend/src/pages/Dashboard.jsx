import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Tooltip,
  useTheme,
  alpha,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  AssignmentTurnedIn as TaskCompletedIcon,
  Autorenew as InProgressIcon,
  CalendarToday as CalendarIcon,
  Comment as CommentIcon,
  Dashboard as DashboardIcon,
  Group as TeamIcon,
  More as MoreIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  PersonAdd as JoinTeamIcon,
  SupervisorAccount as EmployeesIcon,
} from "@mui/icons-material";
import { fetchDashboardData } from "../store/slices/dashboardSlice";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  transition: "transform 0.2s, box-shadow 0.2s",
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
  },
}));

const GradientCircularProgress = styled(Box)(({ theme, value, size = 50 }) => {
  const circumference = 2 * Math.PI * (size / 2 - 4);
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return {
    position: "relative",
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      padding: 4,
      background: `conic-gradient(
        ${theme.palette.primary.main} ${value}%, 
        ${alpha(theme.palette.grey[300], 0.4)} ${value}%
      )`,
      WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 4px), #fff 0)`,
    },
  };
});

const StatsCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  borderRadius: 12,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette[color].main,
    0.15
  )} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
  boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  width: 50,
  height: 50,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: alpha(theme.palette[color].main, 0.15),
  color: theme.palette[color].main,
}));

const ProgressBar = styled(Box)(({ theme, color, value }) => ({
  height: 8,
  width: "100%",
  backgroundColor: alpha(theme.palette.grey[300], 0.3),
  borderRadius: 4,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${value || 0}%`,
    backgroundColor: theme.palette[color].main,
    borderRadius: 4,
    transition: "width 1s ease-in-out",
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  textAlign: "left",
  justifyContent: "flex-start",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  transition: "all 0.3s ease",
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  // Try to get data from Redux state
  const dashboardData = useSelector((state) => state.dashboard);
  const [loading, setLoading] = useState(true);

  // Mock data for development and testing
  const mockData = {
    stats: {
      totalProjects: 24,
      activeProjects: 12,
      totalTasks: 86,
      completedTasks: 56,
    },
    recentProjects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description:
          "Building a responsive e-commerce platform with React and Node.js",
        progress: 75,
        status: "In Progress",
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        team: [
          {
            id: "u1",
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          {
            id: "u2",
            name: "Jane Smith",
            avatar: "https://i.pravatar.cc/150?img=5",
          },
          {
            id: "u3",
            name: "Mike Johnson",
            avatar: "https://i.pravatar.cc/150?img=8",
          },
        ],
      },
      {
        id: "2",
        name: "Mobile App Development",
        description: "Creating a cross-platform mobile app using React Native",
        progress: 45,
        status: "In Progress",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        team: [
          {
            id: "u2",
            name: "Jane Smith",
            avatar: "https://i.pravatar.cc/150?img=5",
          },
          {
            id: "u4",
            name: "Sarah Williams",
            avatar: "https://i.pravatar.cc/150?img=9",
          },
        ],
      },
      {
        id: "3",
        name: "UI/UX Redesign",
        description:
          "Revamping the user interface and experience of our main product",
        progress: 90,
        status: "Completed",
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        team: [
          {
            id: "u1",
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          {
            id: "u5",
            name: "Alex Turner",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
        ],
      },
    ],
    recentActivities: [
      {
        id: "a1",
        type: "task_completed",
        description: "John Doe completed the Login Page UI development task",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "u1",
          name: "John Doe",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
      },
      {
        id: "a2",
        type: "new_comment",
        description: "Jane Smith commented on API Integration document",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "u2",
          name: "Jane Smith",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
      },
      {
        id: "a3",
        type: "deadline_updated",
        description: "Mike Johnson updated the deadline for Database Design",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "u3",
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?img=8",
        },
      },
      {
        id: "a4",
        type: "user_joined",
        description: "Sarah Williams joined the E-commerce Platform project",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "u4",
          name: "Sarah Williams",
          avatar: "https://i.pravatar.cc/150?img=9",
        },
      },
    ],
    upcomingEvents: [
      {
        id: "e1",
        title: "Weekly Team Meeting",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        time: "10:00 AM - 11:30 AM",
        location: "Conference Room A",
      },
      {
        id: "e2",
        title: "Project Deadline: UI/UX Redesign",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: "All Day",
      },
      {
        id: "e3",
        title: "Client Presentation",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: "2:00 PM - 3:30 PM",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchDashboardData());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "primary";
      case "not started":
        return "default";
      default:
        return "default";
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "No timestamp";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "Just now";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_completed":
        return <TaskCompletedIcon />;
      case "new_comment":
        return <CommentIcon />;
      case "deadline_updated":
        return <CalendarIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  const quickActions = [
    {
      title: "Create New Project",
      icon: <AddIcon />,
      path: "/projects/create",
      description: "Start a new project from scratch",
      color: "primary",
    },
    ...(user?.role === "leader"
      ? [
          {
            title: "Create Team",
            icon: <TeamIcon />,
            path: "/teams/new",
            description: "Form a new team for collaboration",
            color: "success",
          },
          {
            title: "View Available Employees",
            icon: <EmployeesIcon />,
            path: "/employees",
            description: "Browse available team members",
            color: "info",
          },
        ]
      : [
          {
            title: "Join a Team",
            icon: <JoinTeamIcon />,
            path: "/teams/join",
            description: "Join an existing team",
            color: "secondary",
          },
        ]),
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const data = dashboardData || mockData;

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your projects
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.title}>
              <QuickActionButton
                fullWidth
                variant="outlined"
                color={action.color}
                startIcon={action.icon}
                onClick={() => navigate(action.path)}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </Box>
              </QuickActionButton>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="primary">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <IconBox color="primary">
                  <DashboardIcon />
                </IconBox>
                <Box ml={2}>
                  <Typography variant="h6" color="text.secondary">
                    Total Projects
                  </Typography>
                  <Typography variant="h4">
                    {data.stats?.totalProjects || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        {/* ... other stats cards ... */}
      </Grid>

      {/* Recent Projects */}
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5">Recent Projects</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/projects/create")}
          >
            New Project
          </Button>
        </Box>
        <Grid container spacing={3}>
          {data.recentProjects?.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <StyledCard>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6">{project.name}</Typography>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Box mb={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Progress
                    </Typography>
                    <ProgressBar
                      color="primary"
                      value={project.progress || 0}
                    />
                    <Typography variant="body2" align="right">
                      {project.progress || 0}%
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <AvatarGroup max={4}>
                      {project.team?.map((member) => (
                        <Avatar
                          key={member.id}
                          alt={member.name}
                          src={member.avatar}
                        />
                      ))}
                    </AvatarGroup>
                    <Typography variant="caption" color="text.secondary">
                      Due: {formatDate(project.dueDate)}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
