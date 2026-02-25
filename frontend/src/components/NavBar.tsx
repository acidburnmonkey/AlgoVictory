import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';

function NavBar() {
    const { isAuthenticated, user, avatar, logout } = useAuth();
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
                {/* Left — Home */}
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
                    <AutoGraphRoundedIcon
                        sx={{
                            fontSize: 22,
                            color: 'primary.main',
                            WebkitTextFillColor: 'initial',
                        }}
                    />
                    AlgoVictory
                </Typography>

                {/* Right — Auth buttons or Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isAuthenticated === null ? null : isAuthenticated ? (
                        <>
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
                                            boxShadow: (t) => `0 8px 32px ${alpha('#000', 0.5)}`,
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
