import { CreateListRequest, CreateTaskRequest, ListFilterObject, RefreshTokenRequest, SignInRequest, SignUpRequest, TaskFilterObject } from "@/types/api-request-body";
import apiClient from "./api-client";
import { ApiResponse, RefreshTokenResponse, SignInResponse } from "@/types/api-response";
import { List, Page, Task, User } from "@/types";


export const authService = {
    signIn: async(request: SignInRequest) : Promise<ApiResponse<SignInResponse>> => {
        const response = await apiClient.post('/v1/auth/signin', request);

        return response.data;
    },
    signUp: async(request: SignUpRequest) : Promise<ApiResponse<User>> => {
        const response = await apiClient.post('/v1/auth/signup', request);
        return response.data;
    },
    refreshToken: async(request: RefreshTokenRequest) : Promise<ApiResponse<RefreshTokenResponse>> => {
        const response = await apiClient.post('/v1/auth/refresh-token', request);
        return response.data;
    }
}

export const listService = {
    createList: async(request: CreateListRequest) : Promise<ApiResponse<List>> =>{
        const response = await apiClient.post('/v1/list', request);
        return response.data;
    },
    getLists: async(filter: ListFilterObject) : Promise<ApiResponse<Page<List>>> =>{
        const response = await apiClient.get('/v1/list', { params: filter });
        return response.data;
    },
    deleteList: async(listId: string) => {
        const response = await apiClient.delete(`/v1/list/${listId}`);
        return response.data;
    }
}
export const taskService = {
    createTask: async (request: CreateTaskRequest) : Promise<ApiResponse<Task>> => {
        const response = await apiClient.post('/v1/task', request);
        return response.data;
    },
    getTasks: async (filter: TaskFilterObject) : Promise<ApiResponse<Page<Task>>> => {
        const response = await apiClient.get('/v1/task', { params: filter });
        return response.data;
    },
}