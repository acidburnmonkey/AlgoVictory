import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import Twitter from '@mui/icons-material/Twitter';

type FormProps = {
    route: string;
    method: 'login' | 'register';
};

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const IN_CONSTRUCTION = import.meta.env.VITE_PROD_WIP === 'true';

function Form({ route, method }: FormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLogin = method === 'login';
    console.log('IN_CONSTRUCTION:', IN_CONSTRUCTION);

    const handleGoogleLogin = () => {
        if (!API_URL) {
            alert('API url missing. Set VITE_API_URL in .env');
            return;
        }

        const nextUrl = `${API_URL}/api/social-token/`;
        const params = new URLSearchParams({ process: 'login', next: nextUrl });
        window.location.href = `${API_URL}/accounts/google/login/?${params.toString()}`;
    };

    const handleXlogin = () => {
        if (!API_URL) {
            alert('API url missing. Set VITE_API_URL in .env');
            return;
        }

        const nextUrl = `${API_URL}/api/social-token/`;
        const params = new URLSearchParams({ process: 'login', next: nextUrl });
        window.location.href = `${API_URL}/accounts/twitter/login/?${params.toString()}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post(route, { username, password, email });

            if (isLogin && response.status === 200) {
                login(response.data.access, response.data.refresh);
                navigate('/home');
            } else {
                navigate('/login');
            }
        } catch {
            setError(
                isLogin
                    ? 'Invalid username or password.'
                    : 'Registration failed. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: (t) =>
                        `linear-gradient(145deg, ${alpha(t.palette.background.paper, 0.75)}, ${alpha(t.palette.background.paper, 0.4)})`,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
                    boxShadow: (t) =>
                        `0 8px 32px ${alpha('#000', 0.5)}, inset 0 1px 0 ${alpha(t.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: (t) => alpha(t.palette.primary.main, 0.3),
                        boxShadow: (t) =>
                            `0 12px 40px ${alpha(t.palette.primary.main, 0.1)}, inset 0 1px 0 ${alpha(t.palette.primary.main, 0.15)}`,
                    },
                }}
            >
                {/* Shimmer accent bar */}
                <Box
                    sx={{
                        height: '3px',
                        background:
                            'linear-gradient(90deg, #FF8F00, #FFB300, #FFD54F, #FFB300, #FF8F00)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2.5s infinite linear',
                        '@keyframes shimmer': {
                            '0%': { backgroundPosition: '200% 0' },
                            '100%': { backgroundPosition: '-200% 0' },
                        },
                    }}
                />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 4, sm: 5 } }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background:
                                    'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', mt: -2 }}
                        >
                            {isLogin ? 'Sign in to continue' : 'Join us to get started'}
                        </Typography>

                        <Collapse in={!!error} sx={{ width: '100%' }}>
                            <Alert
                                severity="error"
                                variant="outlined"
                                onClose={() => setError('')}
                            >
                                {error}
                            </Alert>
                        </Collapse>

                        <TextField
                            fullWidth
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineRoundedIcon
                                                sx={{ color: 'text.secondary', fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon
                                                sx={{ color: 'text.secondary', fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {isLogin && (
                            <Typography
                                component={RouterLink}
                                to="/reset-password"
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    alignSelf: 'flex-end',
                                    mt: -2,
                                    '&:hover': {
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                Forgot password?
                            </Typography>
                        )}

                        {!isLogin && (
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon
                                                    sx={{ color: 'text.secondary', fontSize: 20 }}
                                                />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading || IN_CONSTRUCTION}
                            sx={{
                                py: 1.4,
                                fontSize: '0.95rem',
                                mt: 1,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#0a0a0a' }} />
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <Divider
                            flexItem
                            sx={{
                                '&::before, &::after': {
                                    borderColor: (t) => alpha(t.palette.primary.main, 0.15),
                                },
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', px: 1 }}
                            >
                                or
                            </Typography>
                        </Divider>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleGoogleLogin}
                            disabled={loading || IN_CONSTRUCTION}
                            startIcon={<GoogleIcon />}
                            sx={{ py: 1.3 }}
                        >
                            Continue with Google
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleXlogin}
                            disabled={loading || IN_CONSTRUCTION}
                            startIcon={<Twitter />}
                            sx={{ py: 1.3 }}
                        >
                            Continue with X
                        </Button>

                        <Typography variant="body2" sx={{ color: 'text.secondary', pt: 1 }}>
                            {isLogin
                                ? "Don't have an account? "
                                : 'Already have an account? '}
                            <Typography
                                component={RouterLink}
                                to={isLogin ? '/register' : '/login'}
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </Typography>
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default Form;
