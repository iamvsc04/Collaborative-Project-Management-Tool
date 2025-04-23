import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: null,
    priority: "medium",
    accessPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/tasks", formData);
      setSuccess({
        message: "Task created successfully!",
        accessCode: response.data.task.accessCode,
      });
      setTimeout(() => navigate("/tasks"), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create New Task
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success.message}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Access Code: {success.accessCode}
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
            required
          />

          <DatePicker
            label="Deadline"
            value={formData.deadline}
            onChange={(newValue) =>
              setFormData({ ...formData, deadline: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <TextField
            fullWidth
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            margin="normal"
          >
            {priorities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Access Password"
            name="accessPassword"
            type="password"
            value={formData.accessPassword}
            onChange={(e) =>
              setFormData({ ...formData, accessPassword: e.target.value })
            }
            margin="normal"
            required
            helperText="This password will be required for team members to join the task"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Task"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTask;
