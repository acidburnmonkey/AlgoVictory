import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import type { InternalAxiosRequestConfig } from 'axios';

const resolvedBase = (import.meta.env.VITE_API_URL ?? '')
    .toString()
    .replace(/\/$/, '');
const defaultBase = resolvedBase || 'http://127.0.0.1:8000/api';

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

const api = axios.create({
    baseURL: defaultBase,
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
}

const serverOrigin = new URL(defaultBase).origin;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        const refresh = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh) return Promise.reject(error);

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`;
                return api(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const res = await axios.post(
                `${serverOrigin}/api/token/refresh/`,
                { refresh },
                { withCredentials: true },
            );
            const newAccess: string = res.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccess);
            processQueue(null, newAccess);
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original);
        } catch {
            processQueue(null, null);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            window.location.reload();
            return Promise.reject(new Error('Session expired'));
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;
