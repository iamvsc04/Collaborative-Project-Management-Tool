import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../../store/slices/projectSlice";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(
    (state) => state.projects
  );
  const { user } = useSelector((state) => state.auth);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    if (projectId) {
      console.log("Fetching project with ID:", projectId);
      dispatch(fetchProjectById(projectId));
    } else {
      console.error("No project ID found in URL");
      navigate("/projects");
    }
  }, [dispatch, projectId, navigate]);

  useEffect(() => {
    if (currentProject) {
      setFormData({
        title: currentProject.title || "",
        description: currentProject.description || "",
        status: currentProject.status || "",
      });
    }
  }, [currentProject]);

  const handleUpdateProject = async () => {
    try {
      await dispatch(updateProject({ id: projectId, ...formData })).unwrap();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        navigate("/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddMember = async () => {
    try {
      await dispatch(addMember({ projectId, email: newMemberEmail })).unwrap();
      setNewMemberEmail("");
      setAddMemberDialogOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await dispatch(removeMember({ projectId, memberId })).unwrap();
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box p={3}>
        <Alert severity="info">Project not found</Alert>
      </Box>
    );
  }

  const isOwner = currentProject.owner._id === user?._id;

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Project Header */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4">{currentProject.title}</Typography>
            {isOwner && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteProject}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
          <Chip
            label={currentProject.status}
            color={
              currentProject.status === "Completed"
                ? "success"
                : currentProject.status === "In Progress"
                ? "primary"
                : "default"
            }
          />
        </Grid>

        {/* Project Description */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {currentProject.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Project Members */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Team Members</Typography>
              {isOwner && (
                <Button
                  startIcon={<PersonAddIcon />}
                  onClick={() => setAddMemberDialogOpen(true)}
                >
                  Add Member
                </Button>
              )}
            </Box>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{currentProject.owner.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={currentProject.owner.name}
                  secondary="Owner"
                />
              </ListItem>
              <Divider />
              {currentProject.members.map((member) => (
                <ListItem key={member._id}>
                  <ListItemAvatar>
                    <Avatar>{member.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={member.email}
                  />
                  {isOwner && member._id !== user?._id && (
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  )}
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
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProject} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
      >
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member Email"
            type="email"
            fullWidth
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
