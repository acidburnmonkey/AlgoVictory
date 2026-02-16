import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function AllauthCallback({ provider = 'google' }) {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const response = await api.get('/api/social-token/');

                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                navigate('/');
            } catch (err: any) {
                console.error(`${provider} login error:`, err);
                setError(
                    err.response?.data?.error ||
                    `Failed to authenticate with ${provider}`,
                );
            }
        };

        handleCallback();
    }, [navigate, provider]);

    if (error) {
        return (
            <div>
                <h2>Authentication Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/login')}>Back to Login</button>
            </div>
        );
    }

    // Render
    return (
        <div>
            <h2>Completing {provider} Sign-In...</h2>
            <p>Please wait while we authenticate you.</p>
        </div>
    );
}

export default AllauthCallback;
