'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import ViewToggle from '@/components/ViewToggle';
import KanbanBoard from '@/components/KanbanBoard';
import CreateListModal from '@/components/CreateListModal';
import { Task, List, ViewMode } from '@/types';
import { CreateListRequest } from '@/types/api-request-body';
import AppLayout from '@/components/AppLayout';

// Mock data for lists and tasks
const mockLists: List[] = [
  {
    id: 'list1',
    title: 'Web Development Project',
    description: 'Frontend redesign and new features implementation',
    listCategory: 'WORK',
    color: 'blue',
    tasks: [
      {
        id: 'l1-t1',
        title: 'Create responsive navigation',
        description: 'Design and implement mobile-first navigation',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        priority: 'high',
        listId: 'list1',
        steps: [
          { id: 'l1-t1-s1', title: 'Design mockup', completed: true, createdAt: new Date() },
          { id: 'l1-t1-s2', title: 'Code HTML structure', completed: true, createdAt: new Date() },
          { id: 'l1-t1-s3', title: 'Add CSS styling', completed: false, createdAt: new Date() },
          { id: 'l1-t1-s4', title: 'Add JavaScript interactions', completed: false, createdAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'l1-t2',
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'todo',
        priority: 'high',
        listId: 'list1',
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'l1-t3',
        title: 'Set up database schema',
        description: 'Design and implement database structure',
        status: 'completed',
        priority: 'medium',
        listId: 'list1',
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'list2',
    title: 'Marketing Campaign',
    description: 'Q3 marketing campaign planning and execution',
    listCategory: 'WORK',
    color: 'green',
    tasks: [
      {
        id: 'l2-t1',
        title: 'Create social media content',
        description: 'Design posts for Instagram, Twitter, and LinkedIn',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'todo',
        priority: 'medium',
        listId: 'list2',
        steps: [
          { id: 'l2-t1-s1', title: 'Brainstorm content ideas', completed: true, createdAt: new Date() },
          { id: 'l2-t1-s2', title: 'Create graphics', completed: false, createdAt: new Date() },
          { id: 'l2-t1-s3', title: 'Write captions', completed: false, createdAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'l2-t2',
        title: 'Plan email campaign',
        description: 'Design and schedule email marketing sequence',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        priority: 'medium',
        listId: 'list2',
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'list3',
    title: 'Learning Goals',
    listCategory: 'PERSONAL',
    description: 'Personal development and skill improvement',
    color: 'purple',
    tasks: [
      {
        id: 'l3-t1',
        title: 'Complete React course',
        description: 'Finish advanced React patterns course',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        priority: 'low',
        listId: 'list3',
        steps: [
          { id: 'l3-t1-s1', title: 'Watch video lectures', completed: true, createdAt: new Date() },
          { id: 'l3-t1-s2', title: 'Complete exercises', completed: false, createdAt: new Date() },
          { id: 'l3-t1-s3', title: 'Build final project', completed: false, createdAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>(mockLists);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (!selectedList) return;

    setLists(prevLists =>
      prevLists.map(list =>
        list.id === selectedList.id
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
              ),
              updatedAt: new Date(),
            }
          : list
      )
    );

    // Update selectedList to reflect changes immediately
    setSelectedList(prev => prev ? {
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
      updatedAt: new Date(),
    } : null);
  };

  const handleTaskDelete = (taskId: string) => {
    if (!selectedList) return;

    setLists(prevLists =>
      prevLists.map(list =>
        list.id === selectedList.id
          ? {
              ...list,
              tasks: list.tasks.filter(task => task.id !== taskId),
              updatedAt: new Date(),
            }
          : list
      )
    );

    setSelectedList(prev => prev ? {
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
      updatedAt: new Date(),
    } : null);
  };

  const handleToggleStatus = (taskId: string) => {
    if (!selectedList) return;

    const task = selectedList.tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      handleTaskUpdate(taskId, { status: newStatus });
    }
  };

  const handleCreateList = async (data: CreateListRequest) => {
    // Generate a new list ID
    const newListId = `list-${Date.now()}`;
    
    // Create new list object
    const newList: List = {
      id: newListId,
      title: data.listTitle,
      description: data.listDescription || '',
      listCategory: data.listCategory,
      color: data.color || 'blue',
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to lists
    setLists(prevLists => [...prevLists, newList]);
    
    // Here you would typically make an API call
    // await createListAPI(data);
  };

  const filteredTasks = selectedList?.tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300',
      green: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
      purple: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300',
      red: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-300',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (selectedList) {
    const listStats = {
      total: selectedList.tasks.length,
      todo: selectedList.tasks.filter(t => t.status === 'todo').length,
      inProgress: selectedList.tasks.filter(t => t.status === 'in-progress').length,
      completed: selectedList.tasks.filter(t => t.status === 'completed').length,
    };

    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedList(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${selectedList.color === 'blue' ? 'bg-blue-500' : selectedList.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedList.title}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedList.description}
                </p>
              </div>
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{listStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{listStats.todo}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{listStats.inProgress}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{listStats.completed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative min-w-80">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks in this list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
          </div>

          {/* Tasks Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                {searchQuery ? (
                  <>
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No tasks found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your search criteria.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No tasks in this list
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add tasks to get started with this project.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Add First Task
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
        </div>
      </AppLayout>
    );
  }

  const totalTasks = lists.reduce((sum, list) => sum + list.tasks.length, 0);
  const completedTasks = lists.reduce((sum, list) => sum + list.tasks.filter(t => t.status === 'completed').length, 0);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Lists
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your tasks into projects and lists
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create List</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Lists</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lists.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => {
            const completedInList = list.tasks.filter(t => t.status === 'completed').length;
            const progressPercentage = list.tasks.length > 0 ? (completedInList / list.tasks.length) * 100 : 0;

            return (
              <div
                key={list.id}
                onClick={() => setSelectedList(list)}
                className={`
                  cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg
                  ${getColorClass(list.color || 'blue')}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{list.title}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{list.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${list.color === 'blue' ? 'bg-blue-500' : list.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Progress</span>
                    <span>{completedInList}/{list.tasks.length} tasks</span>
                  </div>

                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white/60 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>{Math.round(progressPercentage)}% complete</span>
                    <span className="opacity-70">
                      Updated {new Date(list.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New List Card */}
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
          >
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Create New List
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start a new project or organize tasks into a list
            </p>
          </div>
        </div>

        {lists.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No lists yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first list to organize your tasks and projects.
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Your First List
            </button>
          </div>
        )}
      </div>

      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateList}
      />
    </AppLayout>
  );
}
