import {createTheme, ThemeOptions} from '@mui/material';

export const themeBase = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f0f0'
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    button: {
      textTransform: 'none'
    },
    h5: {
        fontWeight: 'bold'
    }
  }
});
