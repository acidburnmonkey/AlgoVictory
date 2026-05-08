import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import api from '../api';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';

type FormProps = {
    method: 'sendMail' | 'setNewPassword';
};

function PasswrodReset({ method }: FormProps) {
    const [email, setEmail] = useState<string | null>('');
    const [message, setMessage] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassord] = useState<string>('');
    const [password2, setPassord2] = useState<string>('');
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { token } = useParams();

    //validate tokens are base64url or hex string
    const isValidToken = token && /^[A-Za-z0-9&\-_]+$/.test(token);

    if (method === 'setNewPassword' && !isValidToken) {
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
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Invalid token or expired link
                </Typography>
            </Box>
        );
    }

    const [uid, key] = token?.split('&') ?? [];

    //send mail
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/reset-password/', { email: email });

            if (response.status === 200) {
                setMessage('Check your email for a link to reset your password');
                setSubmitted(true);
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 403) {
                    setMessage('That email does not exist');
                } else {
                    setMessage('Incorrect email');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // new password

    const handleSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');

        if (password !== password2 || password.length <= 0) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/api/set-password/', {
                uid,
                key,
                password,
            });
            if (response.status === 200) {
                setPasswordChanged(true);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                const msg =
                    data?.non_field_errors?.[0] ||
                    data?.error ||
                    data?.detail ||
                    'Something went wrong';
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // glass card wrapper
    const cardSx = {
        width: '100%',
        maxWidth: 420,
        borderRadius: 4,
        overflow: 'hidden',
        background: (t: any) =>
            `linear-gradient(145deg, ${alpha(t.palette.background.paper, 0.75)}, ${alpha(t.palette.background.paper, 0.4)})`,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: (t: any) => `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
        boxShadow: (t: any) =>
            `0 8px 32px ${alpha('#000', 0.5)}, inset 0 1px 0 ${alpha(t.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: (t: any) => alpha(t.palette.primary.main, 0.3),
            boxShadow: (t: any) =>
                `0 12px 40px ${alpha(t.palette.primary.main, 0.1)}, inset 0 1px 0 ${alpha(t.palette.primary.main, 0.15)}`,
        },
    };

    const shimmerBar = (
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
    );

    const gradientTextSx = {
        fontWeight: 700,
        background:
            'linear-gradient(135deg, #FFD54F 0%, #FFB300 50%, #FF8F00 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1,
    };

    if (method === 'sendMail') {
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
                <Box sx={cardSx}>
                    {shimmerBar}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 4, sm: 5 } }}
                    >
                        <Stack spacing={3} alignItems="center">
                            <Typography variant="h4" sx={gradientTextSx}>
                                Reset Password
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mt: -2 }}
                            >
                                Enter your email to receive a reset link
                            </Typography>

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={submitted}
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

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading || submitted}
                                sx={{
                                    py: 1.4,
                                    fontSize: '0.95rem',
                                    mt: 1,
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: '#0a0a0a' }} />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>

                            {message && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: submitted ? 'success.main' : 'error.main',
                                        textAlign: 'center',
                                    }}
                                >
                                    {message}
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', pt: 1 }}
                            >
                                Remember your password?{' '}
                                <Typography
                                    component={RouterLink}
                                    to="/login"
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
                                    Sign In
                                </Typography>
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        );
    } else if (method === 'setNewPassword') {
        if (passwordChanged) {
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
                    <Box sx={cardSx}>
                        {shimmerBar}

                        <Box sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 4, sm: 5 } }}>
                            <Stack spacing={3} alignItems="center">
                                <CheckCircleOutlineIcon
                                    sx={{ fontSize: 56, color: 'success.main' }}
                                />

                                <Typography variant="h4" sx={gradientTextSx}>
                                    Password Changed
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Your password has been updated successfully.
                                </Typography>

                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.4,
                                        fontSize: '0.95rem',
                                        mt: 1,
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            );
        }

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
                <Box sx={cardSx}>
                    {shimmerBar}

                    <Box
                        component="form"
                        onSubmit={handleSetPassword}
                        sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 4, sm: 5 } }}
                    >
                        <Stack spacing={3} alignItems="center">
                            <Typography variant="h4" sx={gradientTextSx}>
                                New Password
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mt: -2 }}
                            >
                                Enter your new password
                            </Typography>

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassord(e.target.value)}
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

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={password2}
                                onChange={(e) => setPassord2(e.target.value)}
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

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 1.4,
                                    fontSize: '0.95rem',
                                    mt: 1,
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: '#0a0a0a' }} />
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>

                            {error && (
                                <Alert severity="error" sx={{ width: '100%' }}>
                                    {error}
                                </Alert>
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default PasswrodReset;
