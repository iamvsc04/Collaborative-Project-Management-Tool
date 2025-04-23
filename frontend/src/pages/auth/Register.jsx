import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Divider,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  styled,
  alpha,
  Container,
  Fade,
  Alert,
  Link,
} from "@mui/material";
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  AccountCircle,
  Badge,
  CheckCircle,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  ArrowBack,
  ArrowForward,
  BusinessCenter,
  EmojiPeople,
  Assignment,
  Cake,
  Phone,
  Info,
} from "@mui/icons-material";
import { register } from "../../store/slices/authSlice";

// Styled components for custom Stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }),
}));

const steps = [
  {
    label: "Personal Info",
    description: "Tell us about yourself",
    icon: <Person />,
  },
  {
    label: "Role Selection",
    description: "Choose your purpose",
    icon: <BusinessCenter />,
  },
  {
    label: "Account Setup",
    description: "Create your account",
    icon: <Lock />,
  },
];

// Password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;

    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;

    return strength;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = () => {
    if (strength === 0) return "No password";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength <= 25) return "error";
    if (strength <= 50) return "warning";
    if (strength <= 75) return "info";
    return "success";
  };

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Password Strength
        </Typography>
        <Chip
          label={getStrengthLabel()}
          color={getStrengthColor()}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.7rem" }}
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getStrengthColor()}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
};

// Custom Step Icon
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {steps[icon - 1].icon}
    </ColorlibStepIconRoot>
  );
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const { loading, error } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    birthday: "",
    jobTitle: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Effect to validate fields on change if they've been touched
  useEffect(() => {
    if (Object.keys(formTouched).length > 0) {
      validateCurrentStep(true);
    }
  }, [formData, activeStep, formTouched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Mark field as touched
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
  };

  const validateCurrentStep = (partialValidation = false) => {
    const newErrors = {};

    // Only validate fields that have been touched if partial validation
    const shouldValidate = (field) => !partialValidation || formTouched[field];

    switch (activeStep) {
      case 0:
        if (shouldValidate("name") && !formData.name.trim()) {
          newErrors.name = "Name is required";
        }
        if (shouldValidate("phone") && formData.phone) {
          const phoneRegex = /^\+?[0-9]{10,15}$/;
          if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
          }
        }
        if (shouldValidate("birthday") && formData.birthday) {
          const birthdayDate = new Date(formData.birthday);
          const today = new Date();
          const age = today.getFullYear() - birthdayDate.getFullYear();
          if (age < 13) {
            newErrors.birthday = "You must be at least 13 years old";
          }
        }
        break;

      case 1:
        if (shouldValidate("role") && !formData.role) {
          newErrors.role = "Please select your role";
        }
        if (
          shouldValidate("jobTitle") &&
          formData.role === "employee" &&
          !formData.jobTitle
        ) {
          newErrors.jobTitle = "Please enter your job title";
        }
        break;

      case 2:
        if (shouldValidate("email")) {
          if (!formData.email) {
            newErrors.email = "Email is required";
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
              newErrors.email = "Please enter a valid email address";
            }
          }
        }

        if (shouldValidate("password")) {
          if (!formData.password) {
            newErrors.password = "Password is required";
          } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
          } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password =
              "Password must contain at least one uppercase letter";
          } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
          }
        }

        if (shouldValidate("confirmPassword")) {
          if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
          } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Mark all fields in current step as touched
    const currentFields = getStepFields(activeStep);
    const newTouched = { ...formTouched };
    currentFields.forEach((field) => {
      newTouched[field] = true;
    });
    setFormTouched(newTouched);

    // Validate step
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
      // Smooth scroll to top on mobile
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ["name", "phone", "birthday"];
      case 1:
        return ["role", "jobTitle"];
      case 2:
        return ["email", "password", "confirmPassword"];
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "role",
      "phone",
      "birthday",
      "jobTitle",
    ];
    const allTouched = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setFormTouched(allTouched);

    // Validate current step
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await dispatch(register(userData)).unwrap();
      navigate("/login");
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    // Redirect to OAuth provider
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get step content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color="text.secondary"
              fontWeight="500"
            >
              Tell us about yourself
            </Typography>

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || "For account recovery"}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Birthday (Optional)"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              error={!!errors.birthday}
              helperText={errors.birthday}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Cake color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color="text.secondary"
              fontWeight="500"
            >
              How will you use Project Hub?
            </Typography>

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.role}
              required
            >
              <InputLabel>What's your goal?</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="What's your goal?"
                startAdornment={
                  <InputAdornment position="start">
                    <EmojiPeople color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="employee">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Assignment sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body1">Team Member</Typography>
                      <Typography variant="caption" color="text.secondary">
                        I want to join a team and collaborate
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="team_lead">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BusinessCenter sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body1">Team Leader</Typography>
                      <Typography variant="caption" color="text.secondary">
                        I want to lead and manage a team
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="solo_creator">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body1">Solo Creator</Typography>
                      <Typography variant="caption" color="text.secondary">
                        I want to track my personal projects
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            {formData.role === "employee" && (
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                error={!!errors.jobTitle}
                helperText={errors.jobTitle}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color="text.secondary"
              fontWeight="500"
            >
              Create secure account credentials
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
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
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
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
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formData.password && (
              <PasswordStrengthIndicator password={formData.password} />
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                gutterBottom
              >
                Or sign up with
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <IconButton
                  onClick={() => handleOAuthLogin("google")}
                  size="large"
                  sx={{
                    color: "#DB4437",
                    bgcolor: alpha("#DB4437", 0.1),
                    "&:hover": { bgcolor: alpha("#DB4437", 0.2) },
                  }}
                >
                  <GoogleIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
            >
              By signing up, you agree to our{" "}
              <Link component={RouterLink} to="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link component={RouterLink} to="/privacy">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMedium ? "column" : "row",
          minHeight: "80vh",
          bgcolor: "background.default",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        {/* Left side - Info panel (hidden on small screens) */}
        {!isMedium && (
          <Box
            sx={{
              width: "40%",
              backgroundColor: theme.palette.primary.main,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: "white",
              display: "flex",
              flexDirection: "column",
              p: 4,
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: 'url("/assets/images/pattern-bg.svg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Join Project Hub
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Create your account and get started with streamlined project
                management
              </Typography>

              <Box sx={{ mb: 6 }}>
                {steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      opacity: activeStep === index ? 1 : 0.7,
                      transform:
                        activeStep === index ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          activeStep === index
                            ? "white"
                            : "rgba(255,255,255,0.3)",
                        color:
                          activeStep === index
                            ? theme.palette.primary.main
                            : "white",
                        mr: 2,
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {step.label}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, display: "flex", alignItems: "center" }}
                >
                  <Info fontSize="small" sx={{ mr: 1 }} />
                  Already have an account?
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{
                    mt: 1,
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Right side - Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ color: theme.palette.text.primary }}
            >
              {isMedium ? "Join Project Hub" : "Create Account"}
            </Typography>

            {/* Mobile login link */}
            {isMedium && (
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Sign In
              </Button>
            )}
          </Box>

          {/* Custom Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            connector={<ColorlibConnector />}
            sx={{ mb: 4, mt: 2 }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <Typography
                    variant="body2"
                    fontWeight={activeStep === index ? "bold" : "normal"}
                  >
                    {step.label}
                  </Typography>
                  {!isMobile && (
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {getStepContent(activeStep)}

              {errors.submit && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errors.submit}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ mr: 1 }}
              >
                Back
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    sx={{
                      minWidth: 120,
                      boxShadow: 2,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        "& .arrow": {
                          transform: "translateX(4px)",
                        },
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        Complete
                        <CheckCircle
                          className="arrow"
                          sx={{ ml: 1, transition: "transform 0.2s" }}
                        />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={
                      <ArrowForward
                        className="arrow"
                        sx={{ transition: "transform 0.2s" }}
                      />
                    }
                    sx={{
                      minWidth: 100,
                      boxShadow: 2,
                      "&:hover": {
                        "& .arrow": {
                          transform: "translateX(4px)",
                        },
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
