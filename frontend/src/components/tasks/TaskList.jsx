import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TaskCard = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        "&:hover": {
          transform: "translateY(-4px)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          </Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Chip
            label={task.priority}
            size="small"
            color={
              task.priority === "high"
                ? "error"
                : task.priority === "medium"
                ? "warning"
                : "success"
            }
          />
          <Chip label={task.status} size="small" variant="outlined" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {task.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={task.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.100",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AvatarGroup max={3}>
            {task.members.map((member, index) => (
              <Avatar
                key={index}
                src={member.avatar}
                alt={member.name}
                sx={{ width: 32, height: 32 }}
              />
            ))}
          </AvatarGroup>
          <Typography variant="caption" color="text.secondary">
            Due {task.deadline}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ onCreateTask }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      textAlign: 'center'
    }}
  >
    <TaskIcon
      sx={{
        fontSize: 64,
        color: 'primary.light',
        mb: 2
      }}
    />
    <Typography variant="h5" gutterBottom>
      No Tasks Yet
    </Typography>
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ mb: 3, maxWidth: 400 }}
    >
      Create your first task to start managing your projects and collaborating with your team.
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onCreateTask}
    >
      Create First Task
    </Button>
  </Box>
);

const TaskList = () => {
  const navigate = useNavigate();
  const { tasks, loading } = useSelector(state => state.tasks);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!tasks?.length) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Tasks
        </Typography>
        <EmptyState onCreateTask={() => navigate('/tasks/create')} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Tasks</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search tasks..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Filter
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              /* Handle create */
            }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TaskCard task={task} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskList;
