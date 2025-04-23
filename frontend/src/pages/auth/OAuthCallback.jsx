import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { setCredentials } from "../../store/slices/authSlice";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(getErrorMessage(errorParam));
      setLoading(false);
      return;
    }

    if (!token || !userParam) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      dispatch(setCredentials({ token, user }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error parsing user data:", error);
      setError("Failed to process authentication data. Please try again.");
      setLoading(false);
    }
  }, [searchParams, navigate, dispatch]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "oauth_failed":
        return "OAuth authentication failed. Please try again.";
      case "server_error":
        return "Server error occurred. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Completing authentication...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
          {error}
        </Alert>
        <Typography
          variant="body1"
          sx={{ cursor: "pointer", color: "primary.main" }}
          onClick={() => navigate("/login")}
        >
          Return to Login
        </Typography>
      </Box>
    );
  }

  return null;
};

export default OAuthCallback;
