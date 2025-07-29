'use client';

import React, { useState, useEffect } from 'react';
import { Task, Step } from '@/types';
import { CreateStepRequest, UpdateStepRequest } from '@/types/api-request-body';

interface DetailTaskProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStepUpdate?: (stepId: string, request: UpdateStepRequest) => void;
  onStepToggle?: (taskId: string, stepId: string) => void;
  onStepAdd?: (request: CreateStepRequest) => void;
  onStepDelete?: (stepId: string) => void;
}

const DetailTask: React.FC<DetailTaskProps> = ({
  task,
  isOpen,
  onClose,
  onStepUpdate: onTaskUpdate,
  onStepToggle,
  onStepAdd,
  onStepDelete
}) => {
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    setNewStepTitle('');
    setIsAddingStep(false);
  }, [task?.taskId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleStepToggle = (stepId: string) => {
    if (task && onStepToggle) {
      onStepToggle(task.taskId, stepId);
    }
  };

  const handleAddStep = () => {
    if (newStepTitle.trim() && task && onStepAdd) {
      onStepAdd({ taskId: task.taskId, stepTitle: newStepTitle.trim() });
      setNewStepTitle('');
      setIsAddingStep(false);
    }
  };

  const handleDeleteStep = (stepId: string) => {
    if (task && onStepDelete) {
      onStepDelete(stepId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddStep();
    } else if (e.key === 'Escape') {
      setIsAddingStep(false);
      setNewStepTitle('');
    }
  };

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    HIGH: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const statusColors = {
    TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  if (!task) return null;

  const completedSteps = task.steps?.filter(step => step.completed).length || 0;
  const totalSteps = task.steps?.length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.taskStatus !== 'COMPLETED';

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Side Panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Task Details
            </h2>
            <button
              onClick={(e) => {
                console.log('X button clicked!');
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Task Title */}
            <div className="mb-6">
              <h1 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${
                task.taskStatus === 'COMPLETED' ? 'line-through text-gray-500' : ''
              }`}>
                {task.taskTitle}
              </h1>
              {task.taskDescription && (
                <p className="text-gray-600 dark:text-gray-400">
                  {task.taskDescription}
                </p>
              )}
            </div>

            {/* Status and Priority Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.taskPriority]}`}>
                {task.taskPriority} Priority
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.taskStatus]}`}>
                {task.taskStatus.replace('_', ' ')}
              </span>
              {isOverdue && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Overdue
                </span>
              )}
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {task.deadline && (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {new Date(task.deadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {task.estimatedTime && (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.estimatedTime} minutes
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {completedSteps}/{totalSteps} steps completed ({Math.round(progressPercentage)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {totalSteps > 0 && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Steps Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Steps ({completedSteps}/{totalSteps})
                </h3>
                <button
                  onClick={() => setIsAddingStep(true)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  + Add Step
                </button>
              </div>

              {/* Steps List */}
              <div className="space-y-2">
                {task.steps?.map((step) => (
                  <div 
                    key={step.stepId}
                    className="flex items-center group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <button
                      onClick={() => handleStepToggle(step.stepId)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                        step.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                      }`}
                    >
                      {step.completed && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    
                    <span className={`flex-1 ${
                      step.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {step.stepTitle}
                    </span>

                    <button
                      onClick={() => handleDeleteStep(step.stepId)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all"
                      title="Delete step"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add New Step Input */}
                {isAddingStep && (
                  <div className="flex items-center p-3 rounded-lg border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 mr-3 flex-shrink-0"></div>
                    <input
                      type="text"
                      value={newStepTitle}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter step title..."
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      autoFocus
                    />
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={handleAddStep}
                        disabled={!newStepTitle.trim()}
                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                        title="Add step"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingStep(false);
                          setNewStepTitle('');
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Empty Steps State */}
              {totalSteps === 0 && !isAddingStep && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No steps yet</p>
                  <button
                    onClick={() => setIsAddingStep(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Add your first step
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Created: {new Date(task.createdAt).toLocaleDateString()}
              {task.updatedAt && (
                <span className="block">
                  Last updated: {new Date(task.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailTask;
