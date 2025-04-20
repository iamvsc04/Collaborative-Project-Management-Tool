import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchProjectById, updateProject, deleteProject } from '../../store/slices/projectSlice';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../store/slices/taskSlice';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading: projectLoading } = useSelector((state) => state.projects);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
  });

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        status: currentProject.status,
        startDate: currentProject.startDate,
        endDate: currentProject.endDate,
      });
    }
  }, [currentProject]);

  const handleEditProject = async () => {
    await dispatch(updateProject({ id, ...formData }));
    setEditDialogOpen(false);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
      navigate('/projects');
    }
  };

  const handleCreateTask = async () => {
    await dispatch(createTask({ ...taskFormData, project: id }));
    setTaskDialogOpen(false);
    setTaskFormData({
      title: '',
      description: '',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '',
    });
  };

  const handleUpdateTask = async (taskId, status) => {
    await dispatch(updateTask({ id: taskId, status }));
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(taskId));
    }
  };

  if (projectLoading || tasksLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{currentProject?.name}</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Edit Project
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteProject}
              >
                Delete Project
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {currentProject?.description}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Status:</strong>{' '}
              <Chip
                label={currentProject?.status}
                color={
                  currentProject?.status === 'Completed'
                    ? 'success'
                    : currentProject?.status === 'In Progress'
                    ? 'primary'
                    : 'default'
                }
              />
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Start Date:</strong>{' '}
              {new Date(currentProject?.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>End Date:</strong>{' '}
              {new Date(currentProject?.endDate).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Tasks</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setTaskDialogOpen(true)}
              >
                Add Task
              </Button>
            </Box>
            <List>
              {tasks.map((task) => (
                <ListItem key={task._id}>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {task.description}
                        </Typography>
                        <br />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={task.status}
                      color={
                        task.status === 'Completed'
                          ? 'success'
                          : task.status === 'In Progress'
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() =>
                        handleUpdateTask(task._id, task.status === 'Completed' ? 'Not Started' : 'Completed')
                      }
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProject} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={taskFormData.description}
            onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={taskFormData.status}
            onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Priority"
            value={taskFormData.priority}
            onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={taskFormData.dueDate}
            onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails; 