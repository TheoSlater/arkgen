import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#007bff', // Example primary color
            },
            secondary: {
              main: '#f0f0f0', // Light grey for assistant messages
            },
            background: {
              default: '#ffffff', // White background
              paper: '#f9f9f9', // Light grey for paper elements
            },
            text: {
              primary: '#333', // Dark text for readability
            },
          }
        : {
            primary: {
              main: '#64b5f6', // Example primary color
            },
            secondary: {
              main: '#333', // Dark grey for assistant messages
            },
            background: {
              default: '#121212', // Dark background
              paper: '#1e1e1e', // Darker grey for paper elements
            },
            text: {
              primary: '#fff', // White text for readability
            },
          }),
    },
    shape: {
      borderRadius: 8, // Slightly less rounded corners
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '#__next': {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  });
