import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Form.css';

type FormProps = {
    route: string;
    method: 'login' | 'register';
};

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

// form for register or login
function Form({ route, method }: FormProps) {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    //Google
    const handleGoogleLogin = () => {
        if (!API_BASE) {
            alert('API url missing. Set VITE_API_URL in .env');
            return;
        }

        const nextUrl = `${window.location.origin}/auth/google/callback`;
        const params = new URLSearchParams({ process: 'login', next: nextUrl });
        window.location.href = `${API_BASE}/accounts/google/login/?${params.toString()}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, { username, password, email });

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container">
                <h1> {method === 'login' ? 'Login' : 'Register'}</h1>

                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                {method === 'register' ? (
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                ) : null}

                <button className="form-button" type="submit">
                    {method === 'login' ? 'Login' : 'Register'}
                </button>
            </form>

            <div>
                <button
                    type="button"
                    className="form-button google"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default Form;
