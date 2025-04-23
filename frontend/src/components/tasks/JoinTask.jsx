import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const JoinTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    accessCode: "",
    accessPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("/tasks/join", formData);
      navigate("/tasks");
    } catch (error) {
      setError(error.response?.data?.message || "Error joining task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
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
          Join Task
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Access Code"
            name="accessCode"
            value={formData.accessCode}
            onChange={(e) =>
              setFormData({ ...formData, accessCode: e.target.value })
            }
            margin="normal"
            required
          />

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
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Join Task"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default JoinTask;
