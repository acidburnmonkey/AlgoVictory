import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    FiberManualRecord as BulletIcon,
    Shield as ShieldIcon,
} from '@mui/icons-material';

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
                {title}
            </Typography>
            {children}
        </Box>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <List dense disablePadding>
            {items.map((item) => (
                <ListItem key={item} disableGutters sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                        <BulletIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={item}
                        slotProps={{
                            primary: {
                                variant: 'body2',
                                color: 'text.secondary',
                            },
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );
}

function PrivacyPolicy() {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 1,
                    }}
                >
                    <ShieldIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                        Privacy Policy
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    <strong>Effective Date:</strong> Jan 28, 2026
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    <strong>Website:</strong> algovictory.com
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    <strong>Contact:</strong> algovictory.unify491@aleeas.com
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Section title="1. Information We Collect">
                    <BulletList
                        items={[
                            'Name and email address',
                            'Account login details',
                            'Payment confirmation details (not card numbers)',
                        ]}
                    />
                </Section>

                <Section title="2. How We Use Information">
                    <BulletList
                        items={[
                            'To create and manage user accounts',
                            'To provide premium services',
                            'To send service-related communications',
                            'To improve website performance',
                            'To prevent fraud and abuse',
                        ]}
                    />
                </Section>

                <Section title="3. What We Do NOT Do">
                    <BulletList
                        items={[
                            'We do NOT sell your personal information.',
                            'We do NOT store your credit card details.',
                            'We do NOT share your information for third-party marketing.',
                        ]}
                    />
                </Section>

                <Section title="4. Payment Processing">
                    <Typography variant="body2" color="text.secondary">
                        All payments are processed securely by third-party payment
                        providers. We do not store or process payment card data on our
                        servers.
                    </Typography>
                </Section>

                <Section title="5. Cookies & Tracking">
                    <Typography variant="body2" color="text.secondary">
                        We may use cookies and analytics tools to improve user experience.
                        You can disable cookies in your browser settings.
                    </Typography>
                </Section>

                <Section title="6. Data Security">
                    <Typography variant="body2" color="text.secondary">
                        We use reasonable security measures including HTTPS encryption and
                        secure hosting. However, no system is 100% secure.
                    </Typography>
                </Section>

                <Section title="7. Data Retention">
                    <Typography variant="body2" color="text.secondary">
                        We retain user information as long as accounts remain active or as
                        required by law.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You may request account deletion by contacting us.
                    </Typography>
                </Section>

                <Section title="8. Your Privacy Rights">
                    <Typography variant="body2" color="text.secondary">
                        Depending on your state, you may have rights to request access to or
                        deletion of your personal data. Contact us at
                        algovictory.unify491@aleeas.com.
                    </Typography>
                </Section>

                <Section title="9. Children's Privacy">
                    <Typography variant="body2" color="text.secondary">
                        This website is not intended for individuals under 18 years of age.
                        We do not knowingly collect data from minors.
                    </Typography>
                </Section>

                <Section title="10. Updates to This Policy">
                    <Typography variant="body2" color="text.secondary">
                        We may update this Privacy Policy periodically. Changes will be
                        posted on this page.
                    </Typography>
                </Section>

                <Divider sx={{ mt: 2, mb: 2 }} />

                <Typography
                    variant="caption"
                    color="text.disabled"
                    textAlign="center"
                    display="block"
                >
                    &copy; 2026 algovictory.com . All rights reserved.
                </Typography>
            </Paper>
        </Container>
    );
}

export default PrivacyPolicy;
