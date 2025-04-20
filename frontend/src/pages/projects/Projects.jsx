import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../store/slices/projectSlice';

const projectStatuses = ['planning', 'active', 'completed', 'on-hold'];

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      startDate: '',
      endDate: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditProject = (project) => {
    setIsEditing(true);
    setFormData({
      ...project,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(updateProject({ id: formData._id, projectData: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    handleClose();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && !projects.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {project.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {project.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End: {new Date(project.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/projects/${project._id}`)}>
                  View Details
                </Button>
                <IconButton size="small" onClick={() => handleEditProject(project)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteProject(project._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="status"
              label="Status"
              name="status"
              select
              value={formData.status}
              onChange={handleChange}
            >
              {projectStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="startDate"
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="endDate"
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects; 