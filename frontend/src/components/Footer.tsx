import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                pt: 3,
                pb: 3,
            }}
        >
            <Divider sx={{ mb: 3 }} />

            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            &copy; {new Date().getFullYear()} AlgoVictory. All rights reserved.
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            · Developer
                        </Typography>
                        <IconButton
                            component="a"
                            href="https://github.com/acidburnmonkey"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: 'primary.main' },
                            }}
                        >
                            <GitHubIcon fontSize="small" />
                        </IconButton>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                        <Link
                            component={RouterLink}
                            to="/privacy-policy"
                            underline="none"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main',
                                    textShadow: (t) =>
                                        `0 0 8px ${alpha(t.palette.primary.main, 0.4)}`,
                                },
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/terms-of-service"
                            underline="none"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main',
                                    textShadow: (t) =>
                                        `0 0 8px ${alpha(t.palette.primary.main, 0.4)}`,
                                },
                            }}
                        >
                            Terms of Service
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;
