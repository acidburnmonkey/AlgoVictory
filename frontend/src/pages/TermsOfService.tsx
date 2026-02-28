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
    Gavel as GavelIcon,
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

function TermsOfService() {
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
                    <GavelIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary">
                        Terms of Service
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    <strong>Effective Date:</strong> Jan 26, 2026
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    <strong>Website:</strong> algovictory.com
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    <strong>Contact:</strong> algovictory.unify491@aleeas.com
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Section title="1. Acceptance of Terms">
                    <Typography variant="body2" color="text.secondary">
                        By accessing, registering, or purchasing premium services from this
                        website, you agree to be bound by these Terms of Service. If you do
                        not agree, you must not use this website.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You must be at least 18 years old (or 21 where required by your
                        state) to use this website.
                    </Typography>
                </Section>

                <Section title="2. Nature of the Service">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        This website provides sports predictions, analysis, and related
                        informational content for entertainment purposes only.
                    </Typography>
                    <BulletList
                        items={[
                            'We do NOT operate a sportsbook.',
                            'We do NOT accept wagers.',
                            'We do NOT facilitate gambling transactions.',
                        ]}
                    />
                </Section>

                <Section title="3. No Guarantee of Accuracy or Winnings">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Sports events are unpredictable. We do not guarantee:
                    </Typography>
                    <BulletList
                        items={[
                            'The accuracy of predictions',
                            'The outcome of any sporting event',
                            'Financial gain or profits',
                        ]}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You assume full responsibility for any financial decisions made
                        based on our content.
                    </Typography>
                </Section>

                <Section title="4. No Financial or Gambling Advice">
                    <Typography variant="body2" color="text.secondary">
                        The content on this website does not constitute financial, legal,
                        investment, or gambling advice. You are responsible for complying
                        with gambling laws in your jurisdiction.
                    </Typography>
                </Section>

                <Section title="5. Premium Subscriptions & Payments">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        If you purchase premium access:
                    </Typography>
                    <BulletList
                        items={[
                            'Payments are processed securely by third-party payment providers.',
                            'We do NOT store credit card or payment information.',
                            'All sales are final unless otherwise stated.',
                            'Accounts may be suspended for fraud, abuse, or chargebacks.',
                        ]}
                    />
                </Section>

                <Section title="6. Account Responsibility">
                    <Typography variant="body2" color="text.secondary">
                        You are responsible for maintaining the confidentiality of your
                        account credentials and all activities under your account.
                    </Typography>
                </Section>

                <Section title="7. Limitation of Liability">
                    <Typography variant="body2" color="text.secondary">
                        To the fullest extent permitted by law, we are not liable for any
                        financial losses, lost profits, or damages arising from use of this
                        website.
                    </Typography>
                </Section>

                <Section title="8. Intellectual Property">
                    <Typography variant="body2" color="text.secondary">
                        All content, predictions, branding, and materials are the property
                        of algovictory.com . Unauthorized reproduction or redistribution is
                        prohibited.
                    </Typography>
                </Section>

                <Section title="9. Governing Law">
                    <Typography variant="body2" color="text.secondary">
                        These Terms are governed by the laws of the United States and the
                        State of Florida.
                    </Typography>
                </Section>

                <Section title="10. Changes to Terms">
                    <Typography variant="body2" color="text.secondary">
                        We reserve the right to update these Terms at any time. Continued
                        use of the website constitutes acceptance of changes.
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

export default TermsOfService;
