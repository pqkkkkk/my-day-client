import React from 'react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string) => void;
  showList?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  showList = false 
}) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const completedSteps = task.steps.filter(step => step.completed).length;
  const progressPercentage = task.steps.length > 0 ? (completedSteps / task.steps.length) * 100 : 0;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
      hover:shadow-md transition-shadow duration-200
      ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`
            font-semibold text-gray-900 dark:text-white mb-1
            ${task.status === 'completed' ? 'line-through text-gray-500' : ''}
          `}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onToggleStatus?.(task.id)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'completed' ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => onEdit?.(task)}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete?.(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar (if has steps) */}
      {task.steps.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Progress: {completedSteps}/{task.steps.length} steps
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tags and metadata */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        <span className={`px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ')}
        </span>

        {task.deadline && (
          <span className={`px-2 py-1 rounded-full font-medium ${
            isOverdue 
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
          }`}>
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}

        {showList && task.listId && (
          <span className="px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            List: {task.listId}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
