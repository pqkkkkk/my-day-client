'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import ViewToggle from '@/components/ViewToggle';
import KanbanBoard from '@/components/KanbanBoard';
import { Task, ViewMode } from '@/types';
import AppLayout from '@/components/AppLayout';

// Mock data for unlisted tasks
const mockUnlistedTasks: Task[] = [
  {
    id: 'u1',
    title: 'Learn new programming language',
    description: 'Explore Rust programming language fundamentals',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    status: 'todo',
    priority: 'medium',
    steps: [
      { id: 'u1-1', title: 'Install Rust', completed: true, createdAt: new Date() },
      { id: 'u1-2', title: 'Read documentation', completed: false, createdAt: new Date() },
      { id: 'u1-3', title: 'Build first project', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'u2',
    title: 'Organize desk workspace',
    description: 'Clean and organize the home office desk',
    status: 'in-progress',
    priority: 'low',
    steps: [
      { id: 'u2-1', title: 'Clear desk surface', completed: true, createdAt: new Date() },
      { id: 'u2-2', title: 'Organize cables', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'u3',
    title: 'Read technical article',
    description: 'Read about microservices architecture patterns',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    status: 'completed',
    priority: 'medium',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'u4',
    title: 'Update portfolio website',
    description: 'Add recent projects to personal portfolio',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks
    status: 'todo',
    priority: 'high',
    steps: [
      { id: 'u4-1', title: 'Gather project screenshots', completed: false, createdAt: new Date() },
      { id: 'u4-2', title: 'Write project descriptions', completed: false, createdAt: new Date() },
      { id: 'u4-3', title: 'Update resume', completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function UnlistedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockUnlistedTasks);
  const [currentView, setCurrentView] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      handleTaskUpdate(taskId, { status: newStatus });
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.deadline && 
      new Date(t.deadline) < new Date() && 
      t.status !== 'completed'
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Tasks Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? (
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
                      setSearchQuery('');
                      setFilterStatus('all');
                      setFilterPriority('all');
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
                  tasks={filteredTasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskEdit={(task) => console.log('Edit task:', task)}
                  onTaskDelete={handleTaskDelete}
                />
              ) : currentView === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(task) => console.log('Edit task:', task)}
                      onDelete={handleTaskDelete}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <TaskCard
                        task={task}
                        onEdit={(task) => console.log('Edit task:', task)}
                        onDelete={handleTaskDelete}
                        onToggleStatus={handleToggleStatus}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Results count */}
        {filteredTasks.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        )}
      </div>
    </AppLayout>
  );
}
