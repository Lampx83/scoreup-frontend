import { experimental_extendTheme as extendTheme } from "@mui/material";

const APP_BAR_HEIGHT = '78px'

const theme = extendTheme({
  app: {
    header: {
      height: APP_BAR_HEIGHT,
    }
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: 'rgb(25,25,25)',
          paper: 'rgba(25,29,30,0.8)'
        },
        primary: {
          main: 'rgb(255,255,255)',
        },
        headerBackground: 'rgba(25,29,30,0.7)',
        sectionBackground: {
          primary: '#0a3d62',
          secondary: '#3c6382',
        },
        border: '#fff',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)',
      }
    },
    light: {
      palette: {
        background: {
          default: '#fff',
          paper: 'rgba(245,245,245,0.8)'
        },
        primary: {
          main: 'rgba(25,29,30,0.84)',
        },
        secondary: {
          main: 'rgba(25,29,30,0.84)',
        },
        // headerBackground: 'rgba(12,36,97,0.7)'
        headerBackground: 'rgba(255,255,255,0.7)',
        sectionBackground: {
          // primary: '#0c2461',
          // secondary: '#1e3799',
          primary: '#4682A9',
          secondary: '#91C8E4',
        },
        border: 'rgba(25,29,30,0.35)',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)',
        text: {
          primary: 'black',
          secondary: '#1A4E8DFF'
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(10px)',
          backgroundImage: 'none',
          borderRadius: '8px',
        },
      }
    },
  },
  typography: {
    fontFamily: 'Monserrat, sans-serif',
    button: {
      textTransform: 'none',
      fontSize: '1rem'
    }
  }
})

export default theme;