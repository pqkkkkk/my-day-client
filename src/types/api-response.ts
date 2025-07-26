import { User } from ".";

export interface ApiResponse<T> {
    data: T;
    statusCode: number;
    message?: string;
    success: boolean;
}
export interface ApiError {
    statusCode: number;
    message: string;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    authenticated: boolean;
}
export interface RefreshTokenResponse{
    accessToken: string;
    refreshToken: string;
}