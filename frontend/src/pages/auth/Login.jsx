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
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  LinkedIn,
  Email,
  Lock,
  ArrowForward,
} from "@mui/icons-material";
import { login, clearError } from "../../store/slices/authSlice";

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
    if (validateForm()) {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const result = await dispatch(login(formData));
      if (!result.error) {
        navigate("/dashboard");
      } else {
        setLoginAttempts((prev) => prev + 1);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      {/* Left side - Login form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 450,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />

          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Log in to your account to continue your workflow
            </Typography>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => dispatch(clearError())}
                  >
                    Dismiss
                  </Button>
                }
              >
                {error}
              </Alert>
            </Fade>
          )}

          {loginAttempts >= 3 && (
            <Fade in={loginAttempts >= 3}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Having trouble?{" "}
                <Link component={RouterLink} to="/forgot-password">
                  Reset your password
                </Link>
              </Alert>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                mb: 2,
                flexDirection: isMobile ? "column" : "row",
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
                color="primary"
                sx={{ mt: isMobile ? 1 : 0 }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 2,
                py: 1.2,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  "& .arrow": {
                    transform: "translateX(4px)",
                  },
                },
              }}
              disabled={loading}
              endIcon={
                <ArrowForward
                  className="arrow"
                  sx={{ transition: "transform 0.2s" }}
                />
              }
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Signing In
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleOAuthLogin("google")}
                disabled={loading}
                sx={{
                  py: 1,
                  color: "#DB4437",
                  borderColor: "#DB4437",
                  "&:hover": {
                    borderColor: "#DB4437",
                    backgroundColor: "rgba(219, 68, 55, 0.04)",
                  },
                }}
              >
                <Google />
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleOAuthLogin("github")}
                disabled={loading}
                sx={{
                  py: 1,
                  color: "#333",
                  borderColor: "#333",
                  "&:hover": {
                    borderColor: "#333",
                    backgroundColor: "rgba(51, 51, 51, 0.04)",
                  },
                }}
              >
                <GitHub />
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleOAuthLogin("linkedin")}
                disabled={loading}
                sx={{
                  py: 1,
                  color: "#0077B5",
                  borderColor: "#0077B5",
                  "&:hover": {
                    borderColor: "#0077B5",
                    backgroundColor: "rgba(0, 119, 181, 0.04)",
                  },
                }}
              >
                <LinkedIn />
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                fontWeight="bold"
                color="primary"
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Right side - Background image with overlay for larger screens */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1.2,
            display: { xs: "none", md: "flex" },
            position: "relative",
            backgroundColor: theme.palette.primary.dark,
            backgroundImage: `url('/assets/images/login-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Typography
              variant="h3"
              color="white"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Project Hub
            </Typography>
            <Typography
              variant="h6"
              color="white"
              align="center"
              sx={{ maxWidth: 500, mb: 4 }}
            >
              Streamline your workflow and boost team productivity with our
              project management solution
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Login;
