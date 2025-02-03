import axios from 'axios';
import i18n from 'i18next';

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

// Create Axios instance
const AxiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
    config => {
        config.headers["Accept-Language"] = i18n.language;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// Response Interceptor
AxiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        return Promise.reject(error);
    }
);

export default AxiosInstance;
