import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createProject, clearError } from "../../store/slices/projectSlice";
import { toast } from "react-toastify";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const CreateProject = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.projects);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    status: "Not Started",
    members: [], // We'll add the current user as owner in the backend
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = () => {
    if (newMemberEmail && !formData.members.includes(newMemberEmail)) {
      setFormData({
        ...formData,
        members: [...formData.members, newMemberEmail],
      });
      setNewMemberEmail("");
    }
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === user?.id) {
      return; // Prevent removing the owner
    }
    setFormData({
      ...formData,
      members: formData.members.filter((id) => id !== memberId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear any previous errors
      dispatch(clearError());

      // Format the deadline if provided
      const projectData = {
        ...formData,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
      };

      console.log("Submitting project data:", projectData);

      const result = await dispatch(createProject(projectData)).unwrap();

      if (!result) {
        throw new Error("No result received from server");
      }

      console.log("Project created successfully:", result);
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to create project");
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create a new project and manage its members. Team members can be added
          directly, while others can join using the project ID.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Team Members
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setOpenMemberDialog(true)}
                  variant="outlined"
                >
                  Add Member
                </Button>
              </Box>

              <Paper variant="outlined" sx={{ p: 2 }}>
                {formData.members.length === 0 ? (
                  <Typography color="text.secondary" align="center">
                    No members added yet
                  </Typography>
                ) : (
                  <List>
                    {formData.members.map((memberId) => (
                      <ListItem key={memberId}>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <ListItemText primary={memberId} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMember(memberId)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/projects")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Create Project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      {/* Add Member Dialog */}
      <Dialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        maxWidth="sm"
        fullWidth
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
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleAddMember();
              setOpenMemberDialog(false);
            }}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateProject;
