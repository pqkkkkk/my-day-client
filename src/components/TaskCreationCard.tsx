'use client';

import React, { useState } from 'react';
import { CreateTaskRequest } from '@/types/api-request-body';
import { useAuth } from '@/contexts/AuthContext';

interface TaskCreationCardProps {
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  listId?: string;
  username?: string;
  className?: string;
}

const TaskCreationCard: React.FC<TaskCreationCardProps> = ({
    onSubmit,
    listId,
    username,
    className = ''
}) => {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    taskTitle: '',
    taskDescription: '',
    taskPriority: 'MEDIUM',
    estimatedTime: undefined,
    actualTime: undefined,
    deadline: undefined,
    listId: listId,
    username: listId != undefined ? undefined : user?.username || username || undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    { value: 'HIGH', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  ] as const;

  const handleChange = (field: keyof CreateTaskRequest, value: string | number | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskTitle.trim()) {
      newErrors.taskTitle = 'Task title is required';
    } else if (formData.taskTitle.trim().length < 3) {
      newErrors.taskTitle = 'Task title must be at least 3 characters long';
    }

    if (formData.estimatedTime && (formData.estimatedTime < 1 || formData.estimatedTime > 1440)) {
      newErrors.estimatedTime = 'Estimated time must be between 1 and 1440 minutes';
    }

    if (formData.deadline && new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        taskTitle: formData.taskTitle.trim(),
        taskDescription: formData.taskDescription?.trim() || undefined,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      };

      console.log('Submitting task:', submitData);
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        taskTitle: '',
        taskDescription: '',
        taskPriority: 'MEDIUM',
        estimatedTime: undefined,
        actualTime: undefined,
        deadline: undefined,
        listId: listId,
      });
      setErrors({});
      setIsExpanded(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      taskTitle: '',
      taskDescription: '',
      taskPriority: 'MEDIUM',
      estimatedTime: undefined,
      deadline: undefined,
      listId: listId,
    });
    setErrors({});
    setIsExpanded(false);
  };

  // Collapsed state - similar to Create New List Card
  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className={`
          border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 
          flex flex-col items-center justify-center text-center 
          hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer
          ${className}
        `}
      >
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Add New Task
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a new task to get things done
        </p>
      </div>
    );
  }

  // Expanded state - form similar to TaskCard layout
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
      transition-shadow duration-200
      ${className}
    `}>
      <form onSubmit={handleSubmit}>
        {/* Header with title input */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter task title..."
              value={formData.taskTitle}
              onChange={(e) => handleChange('taskTitle', e.target.value)}
              className={`
                w-full font-semibold text-gray-900 dark:text-white mb-1 
                bg-transparent border-none outline-none resize-none
                placeholder-gray-400 dark:placeholder-gray-500
                ${errors.taskTitle ? 'text-red-600 dark:text-red-400' : ''}
              `}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.taskTitle && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">{errors.taskTitle}</p>
            )}
            
            <textarea
              placeholder="Add description (optional)..."
              value={formData.taskDescription}
              onChange={(e) => handleChange('taskDescription', e.target.value)}
              className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
              rows={2}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-1 ml-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50"
              title="Save task"
            >
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 mb-4">
          {/* Priority and Estimated Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.taskPriority}
                onChange={(e) => handleChange('taskPriority', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Time
              </label>
              <input
                type="number"
                min="1"
                max="1440"
                placeholder="Enter time in minutes. E.g., 60"
                value={formData.estimatedTime || ''}
                onChange={(e) => handleChange('estimatedTime', e.target.value ? parseInt(e.target.value) : undefined)}
                className={`
                  w-full px-3 py-2 text-sm border rounded-lg 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.estimatedTime 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}
                disabled={isSubmitting}
              />
              {errors.estimatedTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimatedTime}</p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline (optional)
            </label>
            <input
              type="datetime-local"
              value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('deadline', e.target.value ? new Date(e.target.value) : undefined)}
              className={`
                w-full px-3 py-2 text-sm border rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.deadline 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              disabled={isSubmitting}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreationCard;
