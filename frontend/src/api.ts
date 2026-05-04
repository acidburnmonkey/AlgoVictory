import axios from 'axios';
import { ACCESS_TOKEN } from './constants';
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

console.log('API Base URL:', api.defaults.baseURL);

export default api;
