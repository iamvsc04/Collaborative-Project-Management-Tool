import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects/Projects";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./components/routing/PrivateRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Toast from "./components/common/Toast";
import { store } from "./store";
import { loadUser } from "./store/slices/authSlice";
import OAuthCallback from "./pages/auth/OAuthCallback";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("AppContent mounted, loading user...");
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    console.log("Loading state is true, showing spinner");
    return <LoadingSpinner fullScreen />;
  }

  console.log("Rendering app content, isAuthenticated:", isAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated ? (
          <Box sx={{ display: "flex" }}>
            <Navbar />
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - 240px)` },
                ml: { sm: "240px" },
                mt: "64px",
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/team" element={<Team />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Box>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
        <Toast />
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App; 