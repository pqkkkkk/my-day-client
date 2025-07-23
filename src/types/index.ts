// Types for the My Day application

export interface User{
  username: string;
  userPassword: string;
  userEmail: string;
  userFullName: string;
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  listId?: string; // null if it's an unlisted task
  steps: Step[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Step {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface List {
  id: string;
  title: string;
  description?: string;
  listCategory: 'PERSONAL' | 'WORK' | 'STUDY' | 'OTHER';
  color?: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
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
