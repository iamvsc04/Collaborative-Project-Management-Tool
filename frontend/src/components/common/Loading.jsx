import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          mb: 2,
          color: "primary.main",
        }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontWeight: 500,
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%": {
              opacity: 0.6,
            },
            "50%": {
              opacity: 1,
            },
            "100%": {
              opacity: 0.6,
            },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
