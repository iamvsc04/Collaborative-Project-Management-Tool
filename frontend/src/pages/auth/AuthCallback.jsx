import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
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
