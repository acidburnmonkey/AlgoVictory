import axios from 'axios';
import { ACCESS_TOKEN } from './constants';
import type { InternalAxiosRequestConfig } from 'axios';

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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
    (error) => {
        return Promise.reject(error);
    },
);

console.log('API Base URL:', import.meta.env.VITE_API_URL);

export default api;
