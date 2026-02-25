import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

import type { AxiosResponse } from 'axios';
import type { userInfo } from '../interfaces';

interface AuthContextType {
    isAuthenticated: boolean | null;
    user: string | null;
    avatar: string | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        console.debug('calling Auth()');
        auth().catch(() => setIsAuthenticated(false));
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            getUserInfo();
        } else if (isAuthenticated === false) {
            setUser(null);
            setAvatar(null);
        }
    }, [isAuthenticated]);

    //main auth loginc
    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', { refresh });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        const { exp } = jwtDecode(token);
        if (exp! < Date.now() / 1000) {
            await refreshToken();
        } else {
            setIsAuthenticated(true);
        }
    };

    // user-info end point
    const getUserInfo = async () => {
        try {
            const response: AxiosResponse = await api.get('/api/user-info/');
            console.log('response user-info:', response);

            if (response.status === 200) {
                const data: userInfo = response.data;
                setUser(data.username);
                setAvatar(data.avatar);
            }
        } catch (err) {
            console.log('err', err);
        }
    };

    //shared functions
    const login = (access: string, refresh: string) => {
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, avatar, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
