import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2', // LinkedIn Blue
    },
    secondary: {
      main: '#004182', // Dark Blue
    },
    success: {
      main: '#2E7D32', // Green
    },
    background: {
      default: "#f4f4f4", // Light gray background
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body2: {
      color: "#555",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
