import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8f7ac7',
    },
    secondary: {
      main: '#d98fb5',
    },
    background: {
      default: '#e8dcf3',
      paper: '#ffffff',
    },
    text: {
      primary: '#2a2d34',
      secondary: '#4a4d56',
    },
  },
  shape: {
    borderRadius: 12,
  },
})
