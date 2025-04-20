import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Button,
  InputBase,
  alpha,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  Person,
  Dashboard,
  Assignment,
  Group,
  Settings,
  Notifications,
  Search as SearchIcon,
  DarkMode,
  LightMode,
  Close,
  CalendarToday,
  Chat,
  FilterList,
  Help,
} from "@mui/icons-material";
import { logout } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice"; // Assuming you have a theme slice

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme) || {
    darkMode: false,
  }; // Default to light mode if not defined

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New task assigned", read: false },
    { id: 2, text: "Project deadline updated", read: false },
    { id: 3, text: "Meeting in 15 minutes", read: true },
    { id: 4, text: "Comment on your task", read: true },
  ]);

  // Navigation items
  const navItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Projects", icon: <Assignment />, path: "/projects" },
    { text: "Team", icon: <Group />, path: "/team" },
    { text: "Calendar", icon: <CalendarToday />, path: "/calendar" },
    { text: "Messages", icon: <Chat />, path: "/messages" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  // Handle scroll effect for AppBar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Derive user initials from name
  const getUserInitials = () => {
    if (!user?.name) return "U";

    const nameParts = user.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  // Get active background color
  const getActiveBackground = (path) => {
    return location.pathname === path
      ? alpha(theme.palette.primary.main, 0.1)
      : "transparent";
  };

  // Create drawer content
  const drawerContent = (
    <Box
      sx={{ width: 280, height: "100%", overflow: "auto" }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          Project Hub
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider />

      {user && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: theme.palette.secondary.main,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role || "Team Member"}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: "8px",
              m: 1,
              backgroundColor: getActiveBackground(item.path),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight:
                  location.pathname === item.path ? "bold" : "regular",
              }}
            />
            {item.text === "Messages" && (
              <Chip
                label="3"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.75rem" }}
              />
            )}
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Help />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            py: 1,
          }}
        >
          Help Center
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={scrolled ? 4 : 0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          transition: "box-shadow 0.3s ease-in-out",
          borderBottom: scrolled
            ? "none"
            : `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 0.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              color="primary"
              fontWeight="bold"
              sx={{
                mr: 2,
                display: { xs: "none", sm: "block" },
              }}
            >
              Project Hub
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", lg: "flex" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 0.5,
                    color: "text.primary",
                    borderRadius: "8px",
                    textTransform: "none",
                    backgroundColor: getActiveBackground(item.path),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Search Bar */}
            <Box
              sx={{
                position: "relative",
                borderRadius: theme.shape.borderRadius,
                backgroundColor: alpha(theme.palette.common.black, 0.04),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.black, 0.08),
                },
                mr: 1,
                display: { xs: searchOpen ? "flex" : "none", md: "flex" },
                width: { xs: searchOpen ? "100%" : "auto", md: "auto" },
                position: searchOpen ? "absolute" : "static",
                left: searchOpen ? 0 : "auto",
                right: searchOpen ? 0 : "auto",
                p: searchOpen ? 1 : 0,
                zIndex: searchOpen ? 1200 : 1,
              }}
            >
              <Box
                sx={{
                  padding: theme.spacing(0, 2),
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "action.active",
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search…"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: theme.spacing(1, 1, 1, 0),
                    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                    transition: theme.transitions.create("width"),
                    width: "100%",
                    [theme.breakpoints.up("md")]: {
                      width: "20ch",
                    },
                  },
                }}
              />
              {searchOpen && (
                <IconButton size="small" onClick={toggleSearch}>
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>

            {!searchOpen && (
              <IconButton
                sx={{ display: { xs: "flex", md: "none" } }}
                onClick={toggleSearch}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* Filter Button */}
            <Tooltip title="Filter results">
              <IconButton sx={{ ml: 1 }}>
                <FilterList />
              </IconButton>
            </Tooltip>

            {/* Dark Mode Toggle */}
            <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
              <IconButton sx={{ ml: 1 }} onClick={handleThemeToggle}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show notifications"
                aria-controls="menu-notifications"
                aria-haspopup="true"
                onClick={handleNotificationMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={unreadNotificationsCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-notifications"
              anchorEl={notificationAnchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  overflow: "auto",
                  borderRadius: "12px",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">Notifications</Typography>
              </Box>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={handleNotificationClose}
                    sx={{
                      py: 1.5,
                      borderLeft: notification.read
                        ? "none"
                        : `4px solid ${theme.palette.primary.main}`,
                      backgroundColor: notification.read
                        ? "transparent"
                        : alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Avatar
                        sx={{
                          bgcolor: notification.read
                            ? "grey.300"
                            : "primary.main",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Notifications fontSize="small" />
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body1">
                          {notification.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.id % 2 === 0
                            ? "2 hours ago"
                            : "5 minutes ago"}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2">No notifications</Typography>
                </Box>
              )}
              <Divider />
              <Box sx={{ p: 1, textAlign: "center" }}>
                <Button
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/notifications")}
                >
                  View all notifications
                </Button>
              </Box>
            </Menu>

            {/* User Menu */}
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    width: 40,
                    height: 40,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              sx={{ mt: 1 }}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: "12px", minWidth: 200 },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                <Person sx={{ mr: 2 }} /> Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/settings");
                }}
                sx={{ py: 1.5 }}
              >
                <Settings sx={{ mr: 2 }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ py: 1.5, color: theme.palette.error.main }}
              >
                <Logout sx={{ mr: 2 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer - permanent on large screens, temporary on small screens */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              top: 64,
              height: "calc(100% - 64px)",
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Toolbar placeholder */}
      <Toolbar />
    </>
  );
};

export default Navbar;
