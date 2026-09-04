import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    typography: {
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    },
    palette: {
      primary: {
        main: '#8f7ac7',
      },
      secondary: {
        main: '#d98fb5',
      },
      background: { default: '#e8dcf3', paper: '#ffffff' },
    },
    shape: {
      borderRadius: 12,
    },
})
