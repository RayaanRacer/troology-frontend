import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#14b8a6",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;
