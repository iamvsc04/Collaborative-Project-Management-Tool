import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const JoinProject = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Add API call to join project
      // const response = await dispatch(joinProject(projectId)).unwrap();
      setSuccess("Successfully joined the project!");
      setTimeout(() => {
        navigate("/projects");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to join project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Join Project
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Enter the project ID to join an existing project. You can get the
          project ID from the project owner or administrator.
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
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              variant="outlined"
              helperText="Enter the unique project ID provided by the project owner"
            />
          </Box>

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
              Join Project
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default JoinProject;
