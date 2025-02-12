import axios from 'axios';
import i18n, {t} from 'i18next';
import {toast} from "react-toastify";

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
        if (error.response && error.response.status === 401) {
            console.log(error.response);
            setTimeout(() => {
                toast.error(t("Your Session Is Expired"));
            }, 0);
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;
