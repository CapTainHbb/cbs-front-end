import axiosInstance from "./axios_instance";
import {AxiosResponse} from "axios";

export const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
    try {
        // Fetch the image with Axios, setting responseType to 'blob'
        const response: AxiosResponse<Blob> = await axiosInstance({
            url,
            method: 'GET',
            responseType: 'blob', // Important for binary data
        });

        // Create a blob URL from the response data
        return new Blob([response.data], {type: response.data.type});
    } catch (err) {
        console.error('Error fetching image:', err);
        return null;
    }
};