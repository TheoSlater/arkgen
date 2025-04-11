import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#f4f4f4',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
    shape: {
      borderRadius: 12,
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
