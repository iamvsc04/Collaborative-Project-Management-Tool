import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Messages = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Typography variant="body1">
        Messages page content will appear here.
      </Typography>
    </Paper>
  );
};

export default Messages;
