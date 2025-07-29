'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import AppLayout from '@/components/AppLayout';
import { Task } from '@/types';

// Mock data for demonstration
const mockMyDayTasks: Task[] = [
  {
    taskId: '1',
    taskTitle: 'Review project proposal',
    taskDescription: 'Review and provide feedback on the new project proposal',
    deadline: new Date(),
    taskStatus: 'TODO',
    taskPriority: 'HIGH',
    steps: [
      { stepId: '1-1', stepTitle: 'Read document', completed: true, createdAt: new Date() },
      { stepId: '1-2', stepTitle: 'Analyze requirements', completed: false, createdAt: new Date() },
      { stepId: '1-3', stepTitle: 'Provide feedback', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: '2',
    taskTitle: 'Finish UI components',
    taskDescription: 'Complete the remaining UI components for the dashboard',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    taskStatus: 'IN_PROGRESS',
    taskPriority: 'MEDIUM',
    steps: [
      { stepId: '2-1', stepTitle: 'Create TaskCard component', completed: true, createdAt: new Date() },
      { stepId: '2-2', stepTitle: 'Create Calendar component', completed: true, createdAt: new Date() },
      { stepId: '2-3', stepTitle: 'Create Sidebar component', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function MyDayPage() {
  const [tasks, setTasks] = useState<Task[]>(mockMyDayTasks);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.taskId === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
  };

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (task) {
      const newStatus = task.taskStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      handleTaskUpdate(taskId, { taskStatus: newStatus });
    }
  };

  const upcomingTasks = tasks.filter(task => task.taskStatus !== 'COMPLETED');
  const completedTasks = tasks.filter(task => task.taskStatus === 'COMPLETED');

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Day
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Add task clicked')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Task</span>
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>AI Suggestions</span>
          </button>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              AI Suggestions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on your schedule and priorities, here are some tasks recommended for today.
            </p>
          </div>
          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium">
            View All
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingTasks.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-6">
        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Today&apos;s Tasks ({upcomingTasks.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onEdit={(task) => console.log('Edit task:', task)}
                  onDelete={handleTaskDelete}
                  onToggleStatus={handleToggleStatus}
                  showList={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed ({completedTasks.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onEdit={(task) => console.log('Edit task:', task)}
                  onDelete={handleTaskDelete}
                  onToggleStatus={handleToggleStatus}
                  showList={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks for today
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start your day by adding some tasks or let AI suggest tasks for you.
            </p>
            <button
              onClick={() => console.log('Add task clicked')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>
      </div>
    </AppLayout>
  );
}
