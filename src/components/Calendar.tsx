import React, { useState } from 'react';

interface CalendarProps {
  tasks?: Array<{
    id: string;
    title: string;
    deadline: Date;
    status: 'todo' | 'in-progress' | 'completed';
  }>;
}

const Calendar: React.FC<CalendarProps> = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          
          <div className="flex">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="p-2 h-24"></div>;
            }

            const dayTasks = getTasksForDate(day);
            const hasDeadlines = dayTasks.length > 0;
            const hasOverdueTasks = dayTasks.some(task => 
              new Date(task.deadline) < today && task.status !== 'completed'
            );

            return (
              <div
                key={day}
                className={`
                  p-2 h-24 border border-gray-200 dark:border-gray-700 rounded-md
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
                  ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600' : ''}
                  ${hasDeadlines ? 'bg-yellow-50 dark:bg-yellow-900' : ''}
                  ${hasOverdueTasks ? 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-600' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isToday(day) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}
                  ${hasOverdueTasks ? 'text-red-700 dark:text-red-300' : ''}
                `}>
                  {day}
                </div>
                
                {/* Task indicators */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`
                        text-xs px-1 py-0.5 rounded truncate
                        ${task.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' 
                          : hasOverdueTasks 
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        }
                      `}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Has deadlines</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Overdue tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
