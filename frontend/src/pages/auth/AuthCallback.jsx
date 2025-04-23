import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Store token
      localStorage.setItem("token", token);
      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // Handle error
      navigate("/login?error=auth_failed");
    }
  }, [navigate, searchParams]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default AuthCallback;
