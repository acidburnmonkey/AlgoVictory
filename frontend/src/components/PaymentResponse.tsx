import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { alpha } from '@mui/material/styles';
import { useAuth } from './AuthContext';

type Status = {
    status: 'success' | 'cancel';
};

function PaymentResponse({ status }: Status) {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    const { refreshUserInfo, isPremium } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);
        const timeout = setTimeout(() => navigate('/home'), 3000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    // On success, poll user-info until premium flips or redirect fires
    useEffect(() => {
        if (status !== 'success' || isPremium) return;
        const poll = setInterval(() => refreshUserInfo(), 800);
        return () => clearInterval(poll);
    }, [status, isPremium, refreshUserInfo]);

    const isSuccess = status === 'success';

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    p: 6,
                    borderRadius: 4,
                    background: alpha('#1f1f1f', 0.55),
                    backdropFilter: 'blur(16px) saturate(180%)',
                    border: `1px solid ${alpha(isSuccess ? '#66BB6A' : '#EF5350', 0.25)}`,
                    boxShadow: `0 8px 32px ${alpha('#000000', 0.4)}`,
                    maxWidth: 420,
                    width: '100%',
                }}
            >
                {isSuccess ? (
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: 72, color: 'success.main', mb: 2 }}
                    />
                ) : (
                    <CancelOutlinedIcon
                        sx={{ fontSize: 72, color: 'error.main', mb: 2 }}
                    />
                )}

                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {isSuccess ? 'Thank you for your purchase!' : 'Payment cancelled'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {isSuccess
                        ? 'Your premium membership is now active.'
                        : 'No charge was made to your account.'}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                    }}
                >
                    <CircularProgress
                        size={18}
                        thickness={5}
                        color={isSuccess ? 'success' : 'error'}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Redirecting in {countdown}s…
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default PaymentResponse;
