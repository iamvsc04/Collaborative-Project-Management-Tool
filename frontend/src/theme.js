import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3a7bd5",
      light: "#739fe8",
      dark: "#2959a2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00bcd4",
      light: "#4dd0e1",
      dark: "#0097a7",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#80e27e",
      dark: "#087f23",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    background: {
      default: "#f8f9fd",
      paper: "#ffffff",
    },
    text: {
      primary: "#202124",
      secondary: "#5f6368",
      disabled: "#9e9e9e",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    overline: {
      textTransform: "uppercase",
      fontWeight: 600,
      fontSize: "0.75rem",
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(31, 41, 55, 0.06)",
    "0px 4px 6px rgba(31, 41, 55, 0.08)",
    "0px 6px 8px rgba(31, 41, 55, 0.1)",
    "0px 8px 12px rgba(31, 41, 55, 0.12)",
    "0px 10px 14px rgba(31, 41, 55, 0.12)",
    "0px 12px 16px rgba(31, 41, 55, 0.14)",
    "0px 14px 18px rgba(31, 41, 55, 0.14)",
    "0px 16px 20px rgba(31, 41, 55, 0.16)",
    "0px 18px 22px rgba(31, 41, 55, 0.16)",
    "0px 20px 24px rgba(31, 41, 55, 0.16)",
    "0px 22px 26px rgba(31, 41, 55, 0.18)",
    "0px 24px 28px rgba(31, 41, 55, 0.18)",
    "0px 26px 30px rgba(31, 41, 55, 0.18)",
    "0px 28px 32px rgba(31, 41, 55, 0.2)",
    "0px 30px 34px rgba(31, 41, 55, 0.2)",
    "0px 32px 36px rgba(31, 41, 55, 0.2)",
    "0px 34px 38px rgba(31, 41, 55, 0.22)",
    "0px 36px 40px rgba(31, 41, 55, 0.22)",
    "0px 38px 42px rgba(31, 41, 55, 0.22)",
    "0px 40px 44px rgba(31, 41, 55, 0.24)",
    "0px 42px 46px rgba(31, 41, 55, 0.24)",
    "0px 44px 48px rgba(31, 41, 55, 0.24)",
    "0px 46px 50px rgba(31, 41, 55, 0.24)",
    "0px 48px 52px rgba(31, 41, 55, 0.26)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        body: {
          scrollBehavior: "smooth",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
          boxShadow: "none",
          textTransform: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #3a7bd5 0%, #4688e5 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #00bcd4 0%, #29dfec 100%)",
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
      variants: [
        {
          props: { variant: "soft" },
          style: {
            backgroundColor: ({ theme, ownerState }) =>
              alpha(theme.palette[ownerState.color || "primary"].main, 0.1),
            color: ({ theme, ownerState }) =>
              theme.palette[ownerState.color || "primary"].main,
            "&:hover": {
              backgroundColor: ({ theme, ownerState }) =>
                alpha(theme.palette[ownerState.color || "primary"].main, 0.2),
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          "&.Mui-selected": {
            backgroundColor: ({ theme }) =>
              alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
              backgroundColor: ({ theme }) =>
                alpha(theme.palette.primary.main, 0.12),
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          boxShadow: "0px 0px 22px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(8px)",
          backgroundColor: alpha("#ffffff", 0.95),
          color: "#202124",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "box-shadow 0.3s ease",
            "&.Mui-focused": {
              boxShadow: "0px 0px 0px 4px rgba(58, 123, 213, 0.1)",
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 600,
            backgroundColor: alpha("#3a7bd5", 0.04),
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#3a7bd5", 0.02),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          padding: "16px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
