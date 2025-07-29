'use client';

import React, { useEffect, useState } from 'react';
import TaskCard from '@/components/TaskCard';
import ViewToggle from '@/components/ViewToggle';
import KanbanBoard from '@/components/KanbanBoard';
import { Task, ViewMode } from '@/types';
import AppLayout from '@/components/AppLayout';
import TaskCreationCard from '@/components/TaskCreationCard';
import { useApi } from '@/contexts/ApiContext';
import { CreateTaskRequest, TaskFilterObject } from '@/types/api-request-body';
import { toast } from 'sonner';
import { useQuery } from '@/hooks/use-query';
import { useFetchList } from '@/hooks/use-fetch-list';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock data for unlisted tasks
const mockUnlistedTasks: Task[] = [
  {
    taskId: 'u1',
    taskTitle: 'Learn new programming language',
    taskDescription: 'Explore Rust programming language fundamentals',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    taskStatus: 'TODO',
    taskPriority: 'MEDIUM',
    steps: [
      { stepId: 'u1-1', stepTitle: 'Install Rust', completed: true, createdAt: new Date() },
      { stepId: 'u1-2', stepTitle: 'Read documentation', completed: false, createdAt: new Date() },
      { stepId: 'u1-3', stepTitle: 'Build first project', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: 'u2',
    taskTitle: 'Organize desk workspace',
    taskDescription: 'Clean and organize the home office desk',
    taskStatus: 'IN_PROGRESS',
    taskPriority: 'LOW',
    steps: [
      { stepId: 'u2-1', stepTitle: 'Clear desk surface', completed: true, createdAt: new Date() },
      { stepId: 'u2-2', stepTitle: 'Organize cables', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: 'u3',
    taskTitle: 'Read technical article',
    taskDescription: 'Read about microservices architecture patterns',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    taskStatus: 'COMPLETED',
    taskPriority: 'MEDIUM',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: 'u4',
    taskTitle: 'Update portfolio website',
    taskDescription: 'Add recent projects to personal portfolio',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks
    taskStatus: 'TODO',
    taskPriority: 'HIGH',
    steps: [
      { stepId: 'u4-1', stepTitle: 'Gather project screenshots', completed: false, createdAt: new Date() },
      { stepId: 'u4-2', stepTitle: 'Write project descriptions', completed: false, createdAt: new Date() },
      { stepId: 'u4-3', stepTitle: 'Update resume', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function UnlistedTasksPage() {
  const navigate = useRouter();
  const {user, isLoading} = useAuth();
  const {taskService}= useApi();
  
  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be resolved

    if (!user) {
      // Redirect to login or show an error
      navigate.push('/signin');
      return;
    }

  }, [user, navigate, isLoading]);

  const {query: taskQuery, updateQuery, resetQuery} = useQuery<TaskFilterObject>({
    currentPage: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
    username: user?.username
  }, true); // Enable auto username update
  const {data: tasks} = useFetchList<TaskFilterObject, Task>('task', taskQuery);

  const [currentView, setCurrentView] = useState<ViewMode>('grid');

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {

  };

  const handleTaskDelete = (taskId: string) => {
  };

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (task) {
      const newStatus = task.taskStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      handleTaskUpdate(taskId, { taskStatus: newStatus });
    }
  };
  const handleCreateTask = async (request: CreateTaskRequest) => {
    try {
      const newTask = (await taskService.createTask(request)).data;
      toast.success('Task created successfully');
    }
    catch (error) {
      toast.error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.taskStatus === 'TODO').length,
    inProgress: tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.taskStatus === 'COMPLETED').length,
    overdue: tasks.filter(t =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.taskStatus !== 'COMPLETED'
    ).length,
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Unlisted Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tasks that don&apos;t belong to any specific list or project
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{taskStats.todo}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskStats.inProgress}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{taskStats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative min-w-80">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskQuery.taskTitle || ''}
                onChange={(e) => updateQuery({ taskTitle: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={taskQuery.taskStatus}
                onChange={(e) => 
                  updateQuery({ taskStatus: e.target.value as 'TODO' | 'IN_PROGRESS' | 'COMPLETED' })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                value={taskQuery.taskPriority}
                onChange={(e) =>
                   updateQuery({ taskPriority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Tasks Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              {taskQuery.taskTitle != undefined || taskQuery.taskStatus !== undefined || taskQuery.taskPriority !== undefined ? (
                <>
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      resetQuery();
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No unlisted tasks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create tasks that don&apos;t belong to any specific project.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Add Your First Task
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {currentView === 'kanban' ? (
                <KanbanBoard
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskEdit={(task) => console.log('Edit task:', task)}
                  onTaskDelete={handleTaskDelete}
                  onTaskCreate={handleCreateTask}
                />
              ) : currentView === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onEdit={(task) => console.log('Edit task:', task)}
                      onDelete={handleTaskDelete}
                      onToggleStatus={handleToggleStatus}
                      showProgress={true}
                    />
                  ))}
                  <TaskCreationCard onSubmit={handleCreateTask} />
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.taskId} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <TaskCard
                        task={task}
                        onEdit={(task) => console.log('Edit task:', task)}
                        onDelete={handleTaskDelete}
                        onToggleStatus={handleToggleStatus}
                        showProgress={true}
                      />
                    </div>
                  ))}
                  <TaskCreationCard
                    onSubmit={handleCreateTask}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Results count */}
        {tasks.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {tasks.length} of {tasks.length} tasks
          </div>
        )}
      </div>
    </AppLayout>
  );
}
