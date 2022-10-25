import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#1976d2",
      kt1Green: "#006525", 
    },
    grey: {
      G5: "#F9F9F9",
      G10: "#F4F4F4",
      G20: "#E0E0E0",
      G30: "#C6C6C6",
      G40: "#A8A8A8",
      G50: "#8D8D8D",
      G60: "#6F6F6F",
      G70: "#525252",
      G80: "#393939",
      G90: "#262626",
      G100: "161616",
    },
    background: {
      default: "#F7F7F7",
    },
  },
  typography: {
    htmlFontSize: 18
  }
});

theme.spaces = {
  contentPT: 3,
  headerHeight: 16,
  adOptMinWidthL: 200,
  adOptMinWidthM: 150,
  adOptMinWidthS: 100,
  sidebarWidth: 70,
};

// const primary = theme.palette.primary;
// const grey = theme.palette.grey;

theme.components = {
  MuiButtonBase: {
    defaultProps: {
      // disableRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      disableRipple: true,
      // variant: "contained",
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'capitalize'
      }
    }
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        marginBottom: 0,
        textTransform: "none",
      },
    },
  },
};

export default theme;
