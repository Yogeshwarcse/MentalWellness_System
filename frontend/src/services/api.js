import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '') + '/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('auth/login', credentials),
    register: (userData) => api.post('auth/register', userData),
};

export const wellnessService = {
    processVoice: (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.wav');
        return api.post('wellness/process-voice', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getHistory: () => api.get('wellness/history'),
};

export const crisisService = {
    evaluate: (formData) => api.post('crisis/evaluate', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const aiService = {
    respond: (payload) => api.post('ai/respond', payload),
};

export const wearableService = {
    postHeartRate: (data) => api.post('wearable/heart-rate', data),
};

export const mindfulnessService = {
    generate: () => api.post('mindfulness/generate'),
    getPlans: () => api.get('mindfulness')
};

export default api;
