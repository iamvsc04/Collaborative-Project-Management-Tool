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
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { fetchTeam, addMember, updateMember, removeMember } from "../store/slices/teamSlice";

const Team = () => {
  const dispatch = useDispatch();
  const { team, loading } = useSelector((state) => state.team);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    department: "",
  });

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingMember) {
      await dispatch(updateMember({ id: editingMember._id, ...formData }));
    } else {
      await dispatch(addMember(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      await dispatch(removeMember(memberId));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Team Members</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {team.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{member.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(member)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(member._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {member.email}
                </Typography>
                <Typography variant="body2">
                  Role: {member.role}
                </Typography>
                <Typography variant="body2">
                  Department: {member.department}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMember ? "Edit Team Member" : "Add Team Member"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Role"
              fullWidth
              select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
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
    </Box>
  );
};

export default Team; 