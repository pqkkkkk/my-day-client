import axios, { AxiosInstance } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

const apiClient : AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
})

apiClient.interceptors.request.use(
    (config) =>{
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) =>{
        console.error("Request error:", error);
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) =>{
        if (error.response) {
            const statusCode = error.response.status;
            const data : ApiError = error.response.data;

            if(statusCode >= 500){
                toast.error(`Server error: ${data.message || "An unexpected error occurred."}`);
            }
            else if (statusCode >= 400){
                toast.error(`Client error: ${data.message || "An unexpected error occurred."}`);
            }

            return Promise.reject(data);
        }
        else {
            console.error("Network error:", error.message);
        }
        return Promise.reject(error);
    }
)
export default apiClient;