import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../api';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type FormProps = {
    method: 'sendMail' | 'setNewPassword';
};

function PasswrodReset({ method }: FormProps) {
    const [email, setEmail] = useState<string | null>('');
    const [message, setMessage] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>();

    const { token } = useParams();

    //validate tokens are base64url or hex string
    const isValidToken = token && /^[A-Za-z0-9-_]+$/.test(token);

    if (method === 'setNewPassword' && !isValidToken) {
        return <Typography> Invalid tokens or expired link</Typography>;
    }

    const [uid, ...keyParts] = token?.split('-') ?? [];
    const key = keyParts.join('-');

    //send mail
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/reset-password/', { email: email });

            if (response.status === 200) {
                setMessage(() => 'Check your email for a link to reset your password');
                setSubmitted(true);
            }

            console.log(response);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 403) {
                    setMessage('That email does not exist');
                } else {
                    setMessage('Incorrect email');
                }

                console.error(status);
            }
        }
    };

    return (
        <Box>
            <Box component="form" onSubmit={handleSubmit}>
                <Box>
                    <TextField
                        required
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
                <Button type="submit" disabled={submitted}>
                    Submit
                </Button>
            </Box>
            <Typography> {message} </Typography>
        </Box>
    );
}

export default PasswrodReset;
