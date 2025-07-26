
export interface CreateListRequest{
    listTitle: string;
    listDescription?: string;
    listCategory: 'PERSONAL' | 'WORK' | 'STUDY' | 'OTHER';
    color?: string;
    username: string;
}
export interface ListFilterObject{
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'ASC' | 'DESC';
    listTitle?: string;
    listCategory?: 'PERSONAL' | 'WORK' | 'STUDY' | 'OTHER';
    createdAtFrom?: string;
    createdAtTo?: string;
}


export interface SignInRequest {
    username: string;
    password: string;
}
export interface SignUpRequest {
    userEmail: string;
    userFullName: string;
    userPassword: string;
    username: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}


export interface CreateTaskRequest {
    taskTitle: string;
    taskDescription?: string;
    taskPriority: 'LOW' | 'MEDIUM' | 'HIGH';
    estimatedTime?: number; // in minutes
    actualTime?: number; // in minutes
    deadline?: Date;
    listId?: string; // null if it's an unlisted task
    username?: string;
}
export interface TaskFilterObject {
    currentPage: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'ASC' | 'DESC';
    taskTitle?: string;
    taskStatus?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    taskPriority?: 'LOW' | 'MEDIUM' | 'HIGH';
    createdAtFrom?: string;
    createdAtTo?: string;
    listId?: string; // null if it's an unlisted task
}