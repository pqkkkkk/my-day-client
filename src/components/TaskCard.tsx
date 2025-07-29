import React, { useState } from 'react';
import { Task } from '@/types';
import DetailTask from './DetailTask';
import { useApi } from '@/contexts/ApiContext';
import { CreateStepRequest, UpdateStepRequest } from '@/types/api-request-body';
import { toast } from 'sonner';
import { Update } from 'next/dist/build/swc/types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string) => void;
  showList?: boolean;
  showProgress?: boolean; // Optional prop to control progress bar visibility
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  showList = false,
  showProgress = false // Default to false if not provided
}) => {
  const {stepService} = useApi();

  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const completedSteps = task.steps?.filter(step => step.completed).length;
  const progressPercentage = task.steps?.length > 0 ? (completedSteps / task.steps.length) * 100 : 0;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.taskStatus !== 'COMPLETED';

  const handleCardClick = () => {
    setIsDetailOpen(true);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card click
    action();
  };
  const handleCreateStep = async (request : CreateStepRequest) =>{
    try{
      const newStep = (await stepService.createStep(request)).data;
      toast.success('Step created successfully!');
      
    }
    catch (error) {
      console.error('Error creating step:', error);
    }
  }
  const handleUpdateStep = async (stepId: string, request: UpdateStepRequest) =>{
    try {
      const updatedStep = (await stepService.updateStep(stepId, request)).data;
      toast.success('Step updated successfully!');
    } catch (error) {
      console.error('Error updating step:', error);
      toast.error('Failed to update step');
    }
  }
  const handleDeleteStep = async (stepId: string) => {
    try {
      await stepService.deleteStep(stepId);
      toast.success('Step deleted successfully!');
    } catch (error) {
      console.error('Error deleting step:', error);
      toast.error('Failed to delete step');
    }
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 
      hover:shadow-md transition-shadow duration-200 cursor-pointer
      ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
    `}
      onClick={handleCardClick}
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`
            font-semibold text-gray-900 dark:text-white mb-1
            ${task.taskStatus === 'COMPLETED' ? 'line-through text-gray-500' : ''}
          `}>
            {task.taskTitle}
          </h3>
          {task.taskDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.taskDescription}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-1 ml-2">
          <button
            onClick={(e) => handleActionClick(e, () => onToggleStatus?.(task.taskId))}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title={task.taskStatus === 'COMPLETED' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.taskStatus === 'COMPLETED' ? (
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
            onClick={(e) => handleActionClick(e, () => onEdit?.(task))}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, () => onDelete?.(task.taskId))}
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
      {showProgress && (
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
        <span className={`px-2 py-1 rounded-full font-medium ${priorityColors[task.taskPriority]}`}>
          {task.taskPriority}
        </span>
        
        <span className={`px-2 py-1 rounded-full font-medium ${statusColors[task.taskStatus]}`}>
          {task.taskStatus.replace('-', ' ')}
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
      
      {/* Detail Task Modal - Only render when open */}
      {isDetailOpen == true && (
        <DetailTask
          task={task}
          isOpen={isDetailOpen}
          onClose={() => {
            console.log('Detail closed');
            setIsDetailOpen(false);
          }}
          onStepUpdate={(stepId: string, request: UpdateStepRequest) => {
            handleUpdateStep(stepId, request);
          }}
          onStepToggle={(taskId, stepId) => {
            // Handle step toggle
            console.log('Step toggled:', taskId, stepId);
          }}
          onStepAdd={(request: CreateStepRequest) => {
            handleCreateStep(request);
          }}
          onStepDelete={(stepId: string) => {
            handleDeleteStep(stepId);
          }}
        />
      )}
    </div>
  );
};

export default TaskCard;
