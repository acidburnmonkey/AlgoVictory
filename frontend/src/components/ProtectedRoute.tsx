import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useEffect, useState, type ReactNode } from 'react';

//interfaces
interface ProtectedRouteProps {
    children: ReactNode;
}

//prop
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthoized, setIsAuthorized] = useState<boolean | null>(null);

    // on load
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    //Set refresh Token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (err) {
            console.log(err);
            setIsAuthorized(false);
        }
    };

    //get auth
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decodedToken = jwtDecode(token);
        const tokenExp = decodedToken.exp!;

        if (tokenExp < Date.now() / 1000) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthoized === null) {
        return <div>Loading...</div>;
    }

    return isAuthoized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
