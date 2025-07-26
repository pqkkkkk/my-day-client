'use client';

import React from 'react';
import Calendar from '@/components/Calendar';
import { Task } from '@/types';
import AppLayout from '@/components/AppLayout';
// Mock data for demonstration
const mockTasksWithDeadlines: Task[] = [
  {
    taskId: '1',
    taskTitle: 'Project Review Meeting',
    taskDescription: 'Review Q1 project outcomes',
    deadline: new Date(2025, 6, 20), // July 20, 2025
    taskStatus: 'todo',
    taskPriority: 'high',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: '2',
    taskTitle: 'Submit Monthly Report',
    taskDescription: 'Compile and submit monthly performance report',
    deadline: new Date(2025, 6, 25), // July 25, 2025
    taskStatus: 'in-progress',
    taskPriority: 'medium',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: '3',
    taskTitle: 'Client Presentation',
    taskDescription: 'Present new features to client',
    deadline: new Date(2025, 6, 15), // July 15, 2025 (overdue)
    taskStatus: 'todo',
    taskPriority: 'high',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    taskId: '4',
    taskTitle: 'Code Review',
    taskDescription: 'Review team member\'s pull request',
    deadline: new Date(2025, 6, 18), // July 18, 2025
    taskStatus: 'completed',
    taskPriority: 'medium',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function CalendarPage() {
  const tasksWithDeadlines = mockTasksWithDeadlines.map(task => ({
    id: task.taskId,
    title: task.taskTitle,
    deadline: task.deadline!,
    status: task.taskStatus,
  }));

  const upcomingDeadlines = mockTasksWithDeadlines
    .filter(task => task.deadline && task.taskStatus !== 'completed')
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const overdueCount = mockTasksWithDeadlines.filter(task => 
    task.deadline && 
    new Date(task.deadline) < new Date() && 
    task.taskStatus !== 'completed'
  ).length;

  return (
    <AppLayout>
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your tasks and deadlines in calendar format
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upcoming Deadlines</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingDeadlines.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overdue Tasks</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCount}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockTasksWithDeadlines.filter(task => {
                  const taskDate = new Date(task.deadline!);
                  const now = new Date();
                  return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar tasks={tasksWithDeadlines} />
        </div>

        {/* Upcoming Deadlines Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Deadlines
            </h3>
            
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => {
                const daysUntilDeadline = Math.ceil(
                  (new Date(task.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isOverdue = daysUntilDeadline < 0;
                const isToday = daysUntilDeadline === 0;
                const isTomorrow = daysUntilDeadline === 1;

                return (
                  <div
                    key={task.taskId}
                    className={`
                      p-3 rounded-lg border
                      ${isOverdue 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                        : isToday
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.taskTitle}
                      </h4>
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${task.taskPriority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : task.taskPriority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }
                      `}>
                        {task.taskPriority}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(task.deadline!).toLocaleDateString()}
                      </span>
                      <span className={`
                        text-xs font-medium
                        ${isOverdue 
                          ? 'text-red-600 dark:text-red-400' 
                          : isToday
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {isOverdue 
                          ? `${Math.abs(daysUntilDeadline)} days overdue`
                          : isToday
                          ? 'Due today'
                          : isTomorrow
                          ? 'Due tomorrow'
                          : `${daysUntilDeadline} days left`
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-4">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No upcoming deadlines
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                View This Week
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                View This Month
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Export Calendar
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Import Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
