import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Fade,
  useTheme,
  useMediaQuery,
  FormHelperText,
  LinearProgress,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Google,
  LinkedIn,
  Email,
  Lock,
  ArrowForward,
} from "@mui/icons-material";
import { login, clearError, loadUser } from "../../store/slices/authSlice";
import LoginBackground from "../../assets/images/login-illustration.jpg";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  minHeight: "80vh",
  maxWidth: 1200,
  margin: "2rem auto",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.2s",
    "&:hover": {
      transform: "translateY(-1px)",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
  },
}));

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [formTouched, setFormTouched] = useState({
    email: false,
    password: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Check for remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", formData); 
    try {
      await dispatch(login(formData)).unwrap();
      await dispatch(loadUser()).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleBlur = (field) => {
    setFormTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    if (!formTouched[field]) return "";

    switch (field) {
      case "email":
        if (!formData.email) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
        return "";
      case "password":
        if (!formData.password) return "Password is required";
        if (formData.password.length < 6)
          return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
      }}
    >
      <StyledPaper>
        {!isMobile && (
          <Box
            sx={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: (theme) => `linear-gradient(135deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 100%)`,
              color: "white",
              p: 4,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zm0-10h10v10H10V0z' fill='%23FFFFFF' fill-opacity='0.05'/%3E%3C/svg%3E\")",
                backgroundSize: "20px 20px",
              },
            }}
          >
            <Box
              component="img"
              src={LoginBackground}
              alt="Login"
              sx={{
                width: "80%",
                maxHeight: "60%",
                objectFit: "contain",
                mb: 3,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              gutterBottom
            >
              Welcome to CPMT
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              sx={{ opacity: 0.8 }}
            >
              Manage your projects with ease and efficiency
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            flex: "1",
            p: { xs: 3, sm: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!getFieldError("email")}
              helperText={getFieldError("email")}
              disabled={loading}
              onBlur={() => handleBlur("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              autoComplete="email"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!getFieldError("password")}
              helperText={getFieldError("password")}
              disabled={loading}
              onBlur={() => handleBlur("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="current-password"
            />

            <FormHelperText sx={{ mt: 1, ml: 1 }}>
              Password must be at least 6 characters long
            </FormHelperText>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                mt: 1,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                mt: 3,
                mb: 2,
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 15px rgba(33, 150, 243, 0.3)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                py: 1.5,
                maxWidth: 250,
                borderRadius: "10px",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 15px rgba(66, 133, 244, 0.2)",
                },
              }}
            >
              Sign in with Google
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ fontWeight: 600, textDecoration: "none" }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress variant="indeterminate" />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Signing you in...
              </Typography>
            </Box>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
