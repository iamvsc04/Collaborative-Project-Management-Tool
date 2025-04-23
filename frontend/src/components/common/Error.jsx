import { Box, Typography, Button } from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const Error = ({
  message = "Something went wrong",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        p: 3,
        textAlign: "center",
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: 64,
          color: "error.main",
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        color="error"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Oops!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: 3 }}
      >
        {message}
      </Typography>
      {showRetry && onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default Error;
