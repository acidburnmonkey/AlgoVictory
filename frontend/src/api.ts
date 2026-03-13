import axios from 'axios';
import { ACCESS_TOKEN } from './constants';
import type { InternalAxiosRequestConfig } from 'axios';

const resolvedBase = (import.meta.env.VITE_API_URL ?? '').toString().replace(/\/$/, '');
// default to the backend API root if developer hasn't provided VITE_API_URL
const defaultBase = resolvedBase || 'http://127.0.0.1:8000/api';

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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

console.log('API Base URL:', api.defaults.baseURL);

export default api;

export async function fetchUfcSchedule(season: string = '2026') {
    const url = `https://api.sportsdata.io/v3/mma/scores/json/Schedule/UFC/${season}`;
    const apiKey = import.meta.env.VITE_SPORTS_API_KEY;

    const headers = apiKey ? {
        'Ocp-Apim-Subscription-Key': String(apiKey)
    } : undefined;

    try {
        const resp = await api.get(url, { headers });
        return resp.data;
    } catch (err: any) {

        if (err.response) {
            const status = err.response.status;
            const body = err.response.data;

            throw new Error(`SportsAPI Error ${status}: ${JSON.stringify(body)}`);
        }
        throw new Error(err?.message ?? "Network Error fetching API data");

    }
}