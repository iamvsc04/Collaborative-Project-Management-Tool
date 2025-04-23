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
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../../store/slices/projectSlice";
import { loadUser, refreshToken } from "../../store/slices/authSlice";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(
    (state) => state.projects
  );
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        navigate("/login");
        return;
      }

      if (!isAuthenticated) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          try {
            await dispatch(refreshToken()).unwrap();
            await dispatch(loadUser()).unwrap();
          } catch (refreshError) {
            navigate("/login");
            return;
          }
        }
      }

      if (projectId) {
        dispatch(fetchProjectById(projectId));
      } else {
        navigate("/projects");
      }
    };

    initializeAuth();
  }, [dispatch, projectId, navigate, isAuthenticated]);

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
      setSnackbar({
        open: true,
        message: "Project updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update project",
        severity: "error",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        navigate("/projects");
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Failed to delete project",
          severity: "error",
        });
      }
    }
  };

  const handleAddMember = async () => {
    try {
      await dispatch(addMember({ projectId, email: newMemberEmail })).unwrap();
      setNewMemberEmail("");
      setAddMemberDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Member added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add member",
        severity: "error",
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await dispatch(removeMember({ projectId, memberId })).unwrap();
      setSnackbar({
        open: true,
        message: "Member removed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to remove member",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            <Box>
              <Button
                variant="outlined"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={() => {
                  if (isEditing) {
                    handleUpdateProject();
                  }
                  setIsEditing(!isEditing);
                }}
                sx={{ mr: 1 }}
              >
                {isEditing ? "Save" : "Edit"}
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Description</Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                variant="outlined"
              />
            ) : (
              <Typography variant="body1" paragraph>
                {currentProject.description}
              </Typography>
            )}
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
              <Button
                startIcon={<PersonAddIcon />}
                onClick={() => setAddMemberDialogOpen(true)}
              >
                Add Member
              </Button>
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
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    <PersonRemoveIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetails;
