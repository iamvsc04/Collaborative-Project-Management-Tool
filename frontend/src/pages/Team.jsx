import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
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
  TextField,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  PersonAdd as JoinIcon,
} from "@mui/icons-material";
import { fetchTeam, addTeamMember, updateMember, removeMember, joinTeam } from "../store/slices/teamSlice";

const Team = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { members, loading, error } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    department: "",
  });
  const [joinFormData, setJoinFormData] = useState({
    projectName: "",
  });
  const [formError, setFormError] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchTeam());
    // Check if we should show the join dialog
    if (location.state?.showJoinDialog) {
      handleOpenJoinDialog();
    }
  }, [dispatch, location.state]);

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department || "",
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        email: "",
        role: "member",
        department: "",
      });
    }
    setFormError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (editingMember) {
        await dispatch(updateMember({ id: editingMember._id, ...formData })).unwrap();
      } else {
        await dispatch(addTeamMember(formData)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error.message || "Failed to submit form. Please try again.");
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await dispatch(removeMember(memberId)).unwrap();
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  const handleOpenJoinDialog = () => {
    setJoinFormData({ projectName: "" });
    setJoinError(null);
    setOpenJoinDialog(true);
  };

  const handleCloseJoinDialog = () => {
    setOpenJoinDialog(false);
    setJoinError(null);
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setJoinError(null);
    
    try {
      await dispatch(joinTeam(joinFormData.projectName)).unwrap();
      handleCloseJoinDialog();
    } catch (error) {
      console.error("Error joining team:", error);
      setJoinError(error.message || "Failed to join team. Please try again.");
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Members</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<JoinIcon />}
            onClick={handleOpenJoinDialog}
            sx={{ mr: 2 }}
          >
            Join Team
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!members?.length ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" gutterBottom>
            No Team Members Yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            Start building your team by adding members
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {member.name?.[0] || <GroupIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography color="text.secondary">{member.email}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip label={member.role} size="small" />
                    {member.department && (
                      <Chip label={member.department} size="small" variant="outlined" />
                    )}
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => handleOpenDialog(member)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(member._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMember ? "Edit Team Member" : "Add Team Member"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Role"
              fullWidth
              select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMember ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog}>
        <DialogTitle>Join Team</DialogTitle>
        <form onSubmit={handleJoinSubmit}>
          <DialogContent>
            {joinError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {joinError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              fullWidth
              value={joinFormData.projectName}
              onChange={(e) => setJoinFormData({ projectName: e.target.value })}
              required
              helperText="Enter the name of the project to join its team"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseJoinDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Team; 