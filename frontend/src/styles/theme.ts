import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFB300', // Amber gold
            light: '#FFD54F',
            dark: '#FF8F00',
            contrastText: '#0a0a0a',
        },
        secondary: {
            main: '#FFF8E1',
            contrastText: '#0a0a0a',
        },
        background: {
            default: '#0d0d0d', // Near black base
            paper: alpha('#1a1a1a', 0.6), // Frosted glass panels
        },
        text: {
            primary: '#F5F5F5',
            secondary: '#BDBDBD',
            disabled: '#616161',
        },
        divider: alpha('#FFB300', 0.15),
        error: { main: '#EF5350' },
        warning: { main: '#FFB300' },
        success: { main: '#66BB6A' },
        info: { main: '#42A5F5' },
    },

    typography: {
        fontFamily: `'Inter', 'Segoe UI', sans-serif`,
        h1: { fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600, letterSpacing: '0.05em' },
    },

    shape: {
        borderRadius: 16,
    },

    components: {
        // ── Global body background ──────────────────────────────
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `
                        radial-gradient(ellipse at 20% 20%, rgba(255,179,0,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 80%, rgba(255,143,0,0.06) 0%, transparent 60%),
                        #0d0d0d
                    `,
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                },
            },
        },

        // ── Glass Card ──────────────────────────────────────────
        MuiCard: {
            styleOverrides: {
                root: {
                    background: alpha('#1f1f1f', 0.55),
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: `1px solid ${alpha('#FFB300', 0.15)}`,
                    boxShadow: `0 8px 32px ${alpha('#000000', 0.4)}, inset 0 1px 0 ${alpha('#FFB300', 0.1)}`,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        borderColor: alpha('#FFB300', 0.35),
                        boxShadow: `0 12px 40px ${alpha('#FFB300', 0.12)}, inset 0 1px 0 ${alpha('#FFB300', 0.15)}`,
                    },
                },
            },
        },

        // ── Glass Paper ─────────────────────────────────────────
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: alpha('#1a1a1a', 0.6),
                    backdropFilter: 'blur(12px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                    border: `1px solid ${alpha('#FFB300', 0.12)}`,
                    backgroundImage: 'none',
                },
            },
        },

        // ── Buttons ─────────────────────────────────────────────
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    padding: '10px 24px',
                    transition: 'all 0.25s ease',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
                    color: '#0a0a0a',
                    boxShadow: `0 4px 16px ${alpha('#FFB300', 0.35)}`,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)',
                        boxShadow: `0 6px 24px ${alpha('#FFB300', 0.5)}`,
                        transform: 'translateY(-1px)',
                    },
                },
                outlinedPrimary: {
                    border: `1px solid ${alpha('#FFB300', 0.5)}`,
                    color: '#FFB300',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                        background: alpha('#FFB300', 0.1),
                        border: `1px solid #FFB300`,
                        boxShadow: `0 0 16px ${alpha('#FFB300', 0.2)}`,
                    },
                },
            },
        },

        // ── Text Fields ─────────────────────────────────────────
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        background: alpha('#ffffff', 0.04),
                        backdropFilter: 'blur(8px)',
                        '& fieldset': {
                            borderColor: alpha('#FFB300', 0.2),
                        },
                        '&:hover fieldset': {
                            borderColor: alpha('#FFB300', 0.4),
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFB300',
                            boxShadow: `0 0 0 3px ${alpha('#FFB300', 0.15)}`,
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#FFB300',
                    },
                },
            },
        },

        // ── AppBar ──────────────────────────────────────────────
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: alpha('#0d0d0d', 0.75),
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: `1px solid ${alpha('#FFB300', 0.12)}`,
                    boxShadow: 'none',
                },
            },
        },

        // ── Chip ────────────────────────────────────────────────
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backdropFilter: 'blur(8px)',
                },
                colorPrimary: {
                    background: alpha('#FFB300', 0.15),
                    border: `1px solid ${alpha('#FFB300', 0.3)}`,
                    color: '#FFD54F',
                },
            },
        },

        // ── Divider ─────────────────────────────────────────────
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha('#FFB300', 0.12),
                },
            },
        },

        // ── Tooltip ─────────────────────────────────────────────
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    background: alpha('#1f1f1f', 0.9),
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${alpha('#FFB300', 0.2)}`,
                    borderRadius: 8,
                    fontSize: '0.75rem',
                },
            },
        },
    },
});

export default theme;
