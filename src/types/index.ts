// Types for the My Day application
export interface Pageable{
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
export interface User{
  username: string;
  userPassword: string;
  userEmail: string;
  userFullName: string;
}
export interface Task {
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  taskStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  taskPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  listId?: string; // null if it's an unlisted task
  userId?: string; // Owner of the task
  steps: Step[];
  totalCompletedSteps?: number;
  totalSteps?: number;
  progressPercentage?: number;
}

export interface Step {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface List {
  listId: string;
  listTitle: string;
  listDescription?: string;
  listCategory: 'PERSONAL' | 'WORK' | 'STUDY' | 'OTHER';
  color?: string;
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
  username: string; // Owner of the list
  completedTasksCount?: number;
  totalTasksCount?: number;
  progressPercentage?: number;
}

export interface MyDayTask {
  taskId: string;
  addedAt: Date;
  suggestedByAI?: boolean;
}

export type ViewMode = 'grid' | 'list' | 'kanban';

export interface AppState {
  lists: List[];
  unlistedTasks: Task[];
  myDayTasks: MyDayTask[];
  currentView: ViewMode;
}
