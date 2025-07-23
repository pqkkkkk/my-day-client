'use client';

import AppLayout from '@/components/AppLayout';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: {
      deadlines: true,
      dailyReminders: true,
      weeklyReport: false,
    },
    preferences: {
      defaultView: 'grid',
      autoAddToMyDay: true,
      showCompletedTasks: true,
    },
    account: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your My Day experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: '☀️' },
                    { value: 'dark', label: 'Dark', icon: '🌙' },
                    { value: 'system', label: 'System', icon: '💻' },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleThemeChange(theme.value)}
                      className={`
                        p-3 rounded-lg border-2 transition-colors text-center
                        ${settings.theme === theme.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{theme.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {theme.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  key: 'deadlines',
                  title: 'Deadline Reminders',
                  description: 'Get notified when tasks are approaching their deadlines',
                },
                {
                  key: 'dailyReminders',
                  title: 'Daily Reminders',
                  description: 'Receive daily summaries of your tasks and upcoming deadlines',
                },
                {
                  key: 'weeklyReport',
                  title: 'Weekly Reports',
                  description: 'Get weekly productivity reports and insights',
                },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                      onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default View Mode
                </label>
                <select
                  value={settings.preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                  <option value="kanban">Kanban Board</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-add high priority tasks to My Day
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Automatically add high priority tasks with deadlines to your My Day list
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.preferences.autoAddToMyDay}
                    onChange={(e) => handlePreferenceChange('autoAddToMyDay', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Show completed tasks
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Display completed tasks in your task lists
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.preferences.showCompletedTasks}
                    onChange={(e) => handlePreferenceChange('showCompletedTasks', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.account.name}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    account: { ...prev.account, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    account: { ...prev.account, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Download all your tasks and lists as JSON
                  </p>
                </div>
                <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Import Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Import tasks and lists from a JSON file
                  </p>
                </div>
                <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Import
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Clear All Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Permanently delete all tasks, lists, and settings
                  </p>
                </div>
                <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
