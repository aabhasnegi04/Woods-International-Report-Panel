import { createTheme } from '@mui/material/styles'
import '@fontsource/nunito/200.css'
import '@fontsource/nunito/300.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'

export function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { 
        main: '#8B6F47', // Warm brown
        light: '#A68A64',
        dark: '#6B5536'
      },
      secondary: { 
        main: '#D4A574', // Light beige/tan
        light: '#E8C9A0',
        dark: '#B8895E'
      },
      background: mode === 'light'
        ? { 
            default: '#FAF8F3', // Very light beige
            paper: '#FFFFFF' 
          }
        : { 
            default: '#2C2416', // Dark brown
            paper: '#3A2F1F' 
          },
      text: mode === 'light'
        ? {
            primary: '#3E2723', // Dark brown text
            secondary: '#6D4C41' // Medium brown
          }
        : {
            primary: '#F5E6D3', // Light beige text
            secondary: '#D7C0A8'
          }
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Nunito, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji',
      h4: { fontWeight: 700 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  })
}


