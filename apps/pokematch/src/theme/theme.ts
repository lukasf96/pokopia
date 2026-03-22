import { alpha, createTheme } from '@mui/material/styles'

/** Shadcn-inspired: crisp borders, soft elevation, pill chips — with a vivid primary palette. */
const borderSubtle = 'hsl(240 6% 90%)'
const surfaceMuted = 'hsl(250 42% 98%)'

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a855f7',
      light: '#f3e8ff',
      dark: '#7e22ce',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a',
      light: '#dcfce7',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ea580c',
      light: '#ffedd5',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e11d48',
      light: '#ffe4e6',
      dark: '#be123c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0891b2',
      light: '#cffafe',
      dark: '#0e7490',
      contrastText: '#ffffff',
    },
    background: {
      default: surfaceMuted,
      paper: '#ffffff',
    },
    divider: alpha('#0f172a', 0.08),
    text: {
      primary: 'hsl(240 10% 10%)',
      secondary: 'hsl(240 4% 46%)',
      disabled: 'hsl(240 4% 64%)',
    },
    action: {
      hover: alpha('#4f46e5', 0.06),
      selected: alpha('#4f46e5', 0.1),
    },
    grey: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(15 23 42 / 0.05)',
    '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)',
    '0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)',
    '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.05)',
    '0 20px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.05)',
    '0 25px 50px -12px rgb(15 23 42 / 0.2)',
    '0 25px 50px -12px rgb(15 23 42 / 0.22)',
    '0 25px 50px -12px rgb(15 23 42 / 0.24)',
    '0 25px 50px -12px rgb(15 23 42 / 0.26)',
    '0 25px 50px -12px rgb(15 23 42 / 0.28)',
    '0 25px 50px -12px rgb(15 23 42 / 0.3)',
    '0 25px 50px -12px rgb(15 23 42 / 0.32)',
    '0 25px 50px -12px rgb(15 23 42 / 0.34)',
    '0 25px 50px -12px rgb(15 23 42 / 0.36)',
    '0 25px 50px -12px rgb(15 23 42 / 0.38)',
    '0 25px 50px -12px rgb(15 23 42 / 0.4)',
    '0 25px 50px -12px rgb(15 23 42 / 0.42)',
    '0 25px 50px -12px rgb(15 23 42 / 0.44)',
    '0 25px 50px -12px rgb(15 23 42 / 0.46)',
    '0 25px 50px -12px rgb(15 23 42 / 0.48)',
    '0 25px 50px -12px rgb(15 23 42 / 0.5)',
    '0 25px 50px -12px rgb(15 23 42 / 0.52)',
    '0 25px 50px -12px rgb(15 23 42 / 0.54)',
    '0 25px 50px -12px rgb(15 23 42 / 0.56)',
  ],
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: surfaceMuted,
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: borderSubtle,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
          boxShadow: '0 1px 2px 0 rgb(15 23 42 / 0.06)',
          '&:hover': {
            boxShadow: '0 2px 4px -1px rgb(15 23 42 / 0.1)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          border: `1px solid ${borderSubtle}`,
          '&.Mui-selected': {
            backgroundColor: alpha('#4f46e5', 0.12),
            color: '#4338ca',
            borderColor: alpha('#4f46e5', 0.35),
            '&:hover': {
              backgroundColor: alpha('#4f46e5', 0.16),
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9999,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: `1px solid ${borderSubtle}`,
          borderRadius: 10,
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#0f172a', 0.08),
        },
      },
    },
  },
})
