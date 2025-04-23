import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
} from "@mui/icons-material";

const SearchInput = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      setIsLoading(true);
      setShowResults(true);
      // Simulate API call
      setTimeout(() => {
        setResults([
          {
            type: "task",
            title: "Website Redesign",
            subtitle: "Due in 3 days",
            icon: <TaskIcon color="primary" />,
          },
          {
            type: "person",
            title: "John Smith",
            subtitle: "Frontend Developer",
            icon: <PersonIcon color="info" />,
          },
          {
            type: "document",
            title: "Project Requirements",
            subtitle: "Updated 2 days ago",
            icon: <DocumentIcon color="success" />,
          },
        ]);
        setIsLoading(false);
      }, 500);
    } else {
      setShowResults(false);
      setResults([]);
    }
  };

  return (
    <Box
      ref={searchRef}
      sx={{
        position: "relative",
        width: { xs: "100%", sm: 300 },
      }}
    >
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
            borderRadius: 2,
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? (
                <CircularProgress size={20} color="primary" />
              ) : (
                <SearchIcon color="action" />
              )}
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setResults([]);
                  setShowResults(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showResults && (
        <Fade in={showResults}>
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              borderRadius: 2,
              maxHeight: 400,
              overflow: "auto",
              zIndex: 1300,
            }}
          >
            <List sx={{ py: 1 }}>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <ListItem
                    key={index}
                    button
                    sx={{
                      py: 1,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {result.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {result.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {result.subtitle}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ py: 2, px: 2 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        No results found
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default SearchInput;
