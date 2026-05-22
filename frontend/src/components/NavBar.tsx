import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { payStripe } from '../paymentUtil';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

function NavBar() {
    const { isAuthenticated, isPremium, user, avatar, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    const handleSettings = () => {
        handleMenuClose();
        navigate('/settings');
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                {/* Left — Home + Nav links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        component={RouterLink}
                        to="/home"
                        variant="h6"
                        sx={{
                            textDecoration: 'none',
                            fontWeight: 700,
                            background:
                                'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.8,
                        }}
                    >
                        <img src="/logo.svg" alt="logo" style={{ width: 22, height: 22 }} />
                        AlgoVictory
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/events"
                        variant="text"
                        sx={{
                            color: 'text.primary',
                            '&:hover': {
                                color: 'primary.main',
                                background: (t) => alpha(t.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        Events
                    </Button>
                </Box>

                {/* Right — Auth buttons or Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isAuthenticated === null ? null : isAuthenticated ? (
                        <>
                            {!isPremium && (
                            <Box
                                onClick={payStripe}
                                sx={{
                                    position: 'relative',
                                    borderRadius: '8px',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-150%',
                                        left: '-150%',
                                        width: '400%',
                                        height: '400%',
                                        background:
                                            'conic-gradient(#FFD54F, #FF8F00, #FFB300, #FFD54F)',
                                        animation: 'spinBorder 3s linear infinite',
                                    },
                                    '@keyframes spinBorder': {
                                        '100%': { transform: 'rotate(360deg)' },
                                    },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        position: 'relative',
                                        display: 'block',
                                        borderRadius: '6px',
                                        background: (t) => t.palette.background.default,
                                        px: 2,
                                        py: 0.5,
                                        color: '#FFB300',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        transition: 'color 0.2s ease',
                                        '&:hover': {
                                            color: '#FFB300',
                                        },
                                    }}
                                >
                                    Buy Full Access
                                </Box>
                            </Box>
                            )}
                            <Avatar
                                alt={user ?? undefined}
                                src={avatar ?? undefined}
                                onClick={handleMenuOpen}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    cursor: 'pointer',
                                    border: (t) =>
                                        `2px solid ${alpha(t.palette.primary.main, 0.4)}`,
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: (t) =>
                                            `0 0 12px ${alpha(t.palette.primary.main, 0.35)}`,
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                {!avatar && user?.[0]?.toUpperCase()}
                            </Avatar>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            mt: 1,
                                            minWidth: 180,
                                            background: (t) =>
                                                alpha(t.palette.background.paper, 0.85),
                                            backdropFilter: 'blur(20px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                            border: (t) =>
                                                `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
                                            boxShadow: `0 8px 32px ${alpha('#000', 0.5)}`,
                                        },
                                    },
                                }}
                            >
                                <MenuItem onClick={handleSettings}>
                                    <ListItemIcon>
                                        <PersonOutlineRoundedIcon
                                            sx={{ color: 'text.secondary' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </MenuItem>

                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutRoundedIcon sx={{ color: 'error.main' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{ '& .MuiTypography-root': { color: 'error.main' } }}
                                    >
                                        Logout
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="text"
                                sx={{
                                    color: 'text.primary',
                                    '&:hover': {
                                        color: 'primary.main',
                                        background: (t) => alpha(t.palette.primary.main, 0.08),
                                    },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                size="small"
                                sx={{ px: 2.5 }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
