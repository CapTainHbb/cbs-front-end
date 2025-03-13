import axios from 'axios';
import {AxiosResponse} from "axios";

export const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
    try {
        // Fetch the image with Axios, setting responseType to 'blob'
        const response: AxiosResponse<Blob> = await axios({
            url,
            method: 'GET',
            responseType: 'blob', // Important for binary data
            withCredentials: true,
        });

        // Create a blob URL from the response data
        // @ts-ignore
        return new Blob([response], {type: response?.type});
    } catch (err) {
        console.error('Error fetching image:', err);
        return null;
    }
};