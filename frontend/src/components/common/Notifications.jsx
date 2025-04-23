import React, { useState, useEffect, useRef } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { markNotificationAsRead } from "../../store/slices/notificationSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socket.current = io(API_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // Join user's room for private notifications
      socket.current.emit("join", user._id);

      // Listen for new notifications
      socket.current.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await dispatch(markNotificationAsRead(notification._id));
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
      );
    }
    handleClose();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ width: "100%", p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification._id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.read
                    ? "inherit"
                    : "action.hover",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={notification.sender?.avatar}>
                    {notification.sender?.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.message}
                  secondary={formatDistanceToNow(
                    new Date(notification.createdAt)
                  )}
                />
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
};

export default Notifications;
