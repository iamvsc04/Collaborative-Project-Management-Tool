import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { fetchTasks, createTask, updateTask, deleteTask } from "../store/slices/taskSlice";
import { fetchProjects } from "../store/slices/projectSlice";

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    projectId: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        projectId: "",
        assignedTo: "",
        dueDate: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, ...formData }));
    } else {
      await dispatch(createTask(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(taskId));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(task._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {task.description}
                </Typography>
                <Typography variant="body2">
                  Status: {task.status}
                </Typography>
                <Typography variant="body2">
                  Priority: {task.priority}
                </Typography>
                <Typography variant="body2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Select
              margin="dense"
              fullWidth
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            <Select
              margin="dense"
              fullWidth
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            <Select
              margin="dense"
              fullWidth
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin="dense"
              label="Due Date"
              type="date"
              fullWidth
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Tasks; 