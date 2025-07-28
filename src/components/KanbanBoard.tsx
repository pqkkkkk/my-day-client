import React from 'react';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import TaskCreationCard from './TaskCreationCard';
import { CreateTaskRequest } from '@/types/api-request-body';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskCreate: (request: CreateTaskRequest) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskEdit,
  onTaskDelete,
  onTaskCreate
}) => {

  const columns = [
    { status: 'TODO', title: 'To Do', color: 'border-gray-300' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-300' },
    { status: 'COMPLETED', title: 'Completed', color: 'border-green-300' },
  ] as const;

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.taskStatus === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['taskStatus']) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('application/json');
    const task = JSON.parse(taskData) as Task;
    
    if (task.taskStatus !== newStatus) {
      onTaskUpdate?.(task.taskId, { taskStatus: newStatus });
    }
  };

  return (
    <div className="flex space-x-6 h-full overflow-x-auto">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <div key={column.status} className="flex-1 min-w-80">
            <div
              className={`
                bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-full
                border-2 border-dashed ${column.color} dark:${column.color.replace('300', '600')}
              `}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.taskId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="cursor-move">
                    <TaskCard
                      task={task}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      onToggleStatus={(taskId) => {
                        const newStatus = task.taskStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
                        onTaskUpdate?.(taskId, { taskStatus: newStatus });
                      }}
                      showProgress={true}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p>No tasks in {column.title.toLowerCase()}</p>
                </div>
              )}
              {column.status === 'TODO' && <TaskCreationCard className='mt-3' onSubmit={onTaskCreate} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
