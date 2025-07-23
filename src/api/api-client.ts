import axios, { AxiosInstance } from "axios";


const apiClient : AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
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
            if( error.response.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('user');
                window.location.href = "/login";
            } else{
                console.error("Response error:", error.response.data);
            }
        }
        else {
            console.error("Network error:", error.message);
        }
        return Promise.reject(error);
    }
)

export default apiClient;