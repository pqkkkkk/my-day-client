'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import ViewToggle from '@/components/ViewToggle';
import KanbanBoard from '@/components/KanbanBoard';
import CreateListModal from '@/components/CreateListModal';
import TaskCreationCard from '@/components/TaskCreationCard';
import { Task, List, ViewMode } from '@/types';
import { CreateListRequest, CreateTaskRequest, ListFilterObject, TaskFilterObject } from '@/types/api-request-body';
import AppLayout from '@/components/AppLayout';
import { useApi } from '@/contexts/ApiContext';
import { colorUtils } from '@/utils/color-utils';
import { useQuery } from '@/hooks/use-query';
import { useFetchList } from '@/hooks/use-fetch-list';
import { toast } from 'sonner';


interface ListTasksViewProps {
  selectedList: List;
  onBack: () => void;
}

function ListTasksView({selectedList, onBack}: ListTasksViewProps) {
  const { taskService } = useApi();

  const {query: taskQuery} = useQuery<TaskFilterObject>({
    currentPage: 1,
    pageSize: 10,
    listId: selectedList.listId,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  });
  const {data: tasks, totalPages, addToList} = useFetchList<TaskFilterObject, Task>('task', taskQuery);
  const [currentView, setCurrentView] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (!selectedList) return;
  };

  const handleTaskDelete = (taskId: string) => {
    if (!selectedList) return;
  };

  const handleToggleStatus = (taskId: string) => {
    if (!selectedList) return;

    const task = selectedList.tasks?.find(t => t.taskId === taskId);
    if (task) {
      const newStatus = task.taskStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      handleTaskUpdate(taskId, { taskStatus: newStatus });
    }
  };

  const handleCreateTask = async (request: CreateTaskRequest) => {
    try {
      const newTask = (await taskService.createTask(request)).data;
      addToList(newTask);
      toast.success('Task created successfully');
    }
    catch (error) {
      toast.error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredTasks = tasks?.filter(task =>
    task.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.taskDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const listStats = {
    total: tasks?.length,
    todo: tasks?.filter(t => t.taskStatus === 'TODO').length,
    inProgress: tasks?.filter(t => t.taskStatus === 'IN_PROGRESS').length,
    completed: tasks?.filter(t => t.taskStatus === 'COMPLETED').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
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
                {selectedList.listTitle}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedList.listDescription}
            </p>
          </div>
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
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add tasks to get started with this project.
                </p>
                
                {/* Task Creation Card for empty state */}
                <div className="max-w-md mx-auto">
                  <TaskCreationCard
                    onSubmit={handleCreateTask}
                    listId={selectedList.listId}
                  />
                </div>
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
                onTaskCreate={handleCreateTask}
              />
            ) : currentView === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.taskId}
                    task={task}
                    onEdit={(task) => console.log('Edit task:', task)}
                    onDelete={handleTaskDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
                {/* Add Task Card - Shows last in grid */}
                <TaskCreationCard
                  onSubmit={handleCreateTask}
                  listId={selectedList.listId}
                />
              </div>
            ) : (
              <div className="space-y-3">                
                {filteredTasks.map((task) => (
                  <div key={task.taskId} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <TaskCard
                      task={task}
                      onEdit={(task) => console.log('Edit task:', task)}
                      onDelete={handleTaskDelete}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                ))}

                {/* Add Task Card - Shows last in list */}
                <TaskCreationCard
                  onSubmit={handleCreateTask}
                  listId={selectedList.listId}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ListsPage() {
  const {listService} = useApi();
  const {query: listQuery, updateQuery, resetQuery } = useQuery<ListFilterObject>({
    currentPage: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  });
  const {data: lists, totalPages} = useFetchList<ListFilterObject, List>('list', listQuery);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateList = async (request: CreateListRequest) => {
    const newList = (await listService.createList(request)).data;
    
    lists.push(newList);
    
  };

  // Nếu có list được chọn, hiển thị ListTasksView
  if (selectedList) {
    return (
      <AppLayout>
        <ListTasksView
          selectedList={selectedList}
          onBack={() => setSelectedList(null)}
        />
      </AppLayout>
    );
  }

  const totalTasks = lists.reduce((sum, list) => sum + (list.tasks?.length || 0), 0);
  const completedTasks = lists.reduce((sum, list) => sum + (list.tasks?.filter(t => t.taskStatus === 'COMPLETED').length || 0), 0);

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
            return (
              <div
                key={list.listId}
                onClick={() => setSelectedList(list)}
                className={`
                  cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg
                  ${colorUtils.getColorClassByHex(list.color || '#f0f0f0')}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{list.listTitle}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{list.listDescription}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${colorUtils.getColorClassByHex(list.color || '#f0f0f0')}`}></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Progress</span>
                    <span>{list.completedTasksCount}/{list.totalTasksCount} tasks</span>
                  </div>

                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white/60 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${list.progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>{Math.round(list.progressPercentage || 0)}% complete</span>
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

