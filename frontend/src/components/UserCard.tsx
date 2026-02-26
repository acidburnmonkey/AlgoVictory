import { Box, Stack, Avatar, Typography, Chip, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PersonIcon from '@mui/icons-material/Person';
import type { userInfo } from '../interfaces';

function UserCard(props: userInfo) {
    const paid = props.premium;

    return (
        <Box
            sx={{
                width: '340px',
                margin: '40px auto',
                borderRadius: 4,
                overflow: 'hidden',
                background: (t) =>
                    `linear-gradient(145deg, ${alpha(t.palette.background.paper, 0.75)}, ${alpha(t.palette.background.paper, 0.4)})`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: (t) =>
                    `1px solid ${alpha(t.palette.primary.main, paid ? 0.35 : 0.12)}`,
                boxShadow: (t) =>
                    paid
                        ? `0 8px 32px ${alpha(t.palette.primary.main, 0.2)}, inset 0 1px 0 ${alpha(t.palette.primary.main, 0.15)}`
                        : `0 8px 32px ${alpha('#000', 0.5)}, inset 0 1px 0 ${alpha('#fff', 0.05)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (t) =>
                        paid
                            ? `0 16px 48px ${alpha(t.palette.primary.main, 0.3)}`
                            : `0 16px 48px ${alpha('#000', 0.6)}`,
                },
            }}
        >
            {paid && (
                <Box
                    sx={{
                        height: '4px',
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
            )}

            <Stack spacing={2.5} alignItems="center" sx={{ padding: '32px 24px' }}>
                {/* Avatar with glowing ring */}
                <Box
                    sx={{
                        position: 'relative',
                        padding: '3px',
                        borderRadius: '50%',
                        background: (t) =>
                            paid
                                ? `linear-gradient(135deg, ${t.palette.primary.dark}, ${t.palette.primary.light})`
                                : `linear-gradient(135deg, #444, #222)`,
                        boxShadow: (t) =>
                            paid ? `0 0 20px ${alpha(t.palette.primary.main, 0.5)}` : 'none',
                    }}
                >
                    <Avatar
                        alt={props.username}
                        src={props.avatar}
                        sx={{
                            width: 90,
                            height: 90,
                            border: '3px solid',
                            borderColor: 'background.default',
                            fontSize: '2rem',
                        }}
                    >
                        {/* Fallback initial if no avatar */}
                        {!props.avatar && props.username?.[0]?.toUpperCase()}
                    </Avatar>

                    {/* Premium crown badge */}
                    {paid && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 2,
                                right: 2,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FFB300, #FF8F00)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid',
                                borderColor: 'background.default',
                            }}
                        >
                            <WorkspacePremiumIcon sx={{ fontSize: 13, color: '#0a0a0a' }} />
                        </Box>
                    )}
                </Box>

                <Box textAlign="center">
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            color: 'text.primary',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {props.username}
                    </Typography>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.5}
                        sx={{ mt: 0.5 }}
                    >
                        <PersonIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            via {props.provider}
                        </Typography>
                    </Stack>
                </Box>

                <Divider
                    flexItem
                    sx={{
                        borderColor: (t) => alpha(t.palette.primary.main, 0.12),
                    }}
                />

                <Chip
                    icon={
                        <WorkspacePremiumIcon
                            sx={{
                                fontSize: '16px !important',
                                color: paid ? '#0a0a0a !important' : 'inherit',
                            }}
                        />
                    }
                    label={paid ? 'Premium User' : 'Free Plan'}
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        px: 1,
                        background: (t) =>
                            paid
                                ? `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`
                                : alpha('#fff', 0.06),
                        color: paid ? '#0a0a0a' : 'text.secondary',
                        border: (t) =>
                            `1px solid ${alpha(t.palette.primary.main, paid ? 0 : 0.2)}`,
                        boxShadow: (t) =>
                            paid
                                ? `0 4px 12px ${alpha(t.palette.primary.main, 0.4)}`
                                : 'none',
                    }}
                />

                {paid && (
                    <Stack
                        spacing={1}
                        sx={{
                            width: '100%',
                            background: (t) => alpha(t.palette.primary.main, 0.06),
                            borderRadius: 3,
                            padding: '12px 16px',
                            border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.12)}`,
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption" color="text.secondary">
                                Member since
                            </Typography>
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                color="primary.light"
                                sx={{ ml: 'auto' }}
                            >
                                {props.payment_date}
                            </Typography>
                        </Stack>

                        <Divider
                            sx={{
                                borderColor: (t) => alpha(t.palette.primary.main, 0.1),
                            }}
                        />

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EventBusyIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Expires
                            </Typography>
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                color="text.primary"
                                sx={{ ml: 'auto' }}
                            >
                                {props.payment_expires}
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

export default UserCard;
