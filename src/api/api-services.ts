import { CreateListRequest, CreateStepRequest, CreateTaskRequest, ListFilterObject, RefreshTokenRequest, SignInRequest, SignUpRequest, TaskFilterObject, UpdateStepRequest } from "@/types/api-request-body";
import apiClient from "./api-client";
import { ApiResponse, RefreshTokenResponse, SignInResponse } from "@/types/api-response";
import { List, Page, Step, Task, User } from "@/types";


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
        console.log('Fetching tasks with filter:', filter);
        const response = await apiClient.get('/v2/task', { params: filter });
        return response.data;
    },
}
export const stepService = {
    createStep: async (request : CreateStepRequest) : Promise<ApiResponse<Step>> => {
        const response = await apiClient.post(`/v1/step`, request);
        return response.data;
    },
    updateStep: async (stepId: string, request: UpdateStepRequest) : Promise<ApiResponse<Step>> => {
        const response = await apiClient.put(`/v1/step/${stepId}`, request);
        return response.data;
    },
    deleteStep: async (stepId: string) : Promise<ApiResponse<void>> => {
        const response = await apiClient.delete(`/v1/step/${stepId}`);
        return response.data;
    }
}