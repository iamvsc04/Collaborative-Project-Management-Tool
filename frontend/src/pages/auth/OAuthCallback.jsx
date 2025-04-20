import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { setCredentials } from "../../store/slices/authSlice";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        dispatch(setCredentials({ token, user }));
        navigate("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

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
        Logging you in...
      </Typography>
    </Box>
  );
};

export default OAuthCallback; 