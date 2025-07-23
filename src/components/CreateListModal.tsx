'use client';

import React, { useState } from 'react';
import { CreateListRequest } from '@/types/api-request-body';
import { useAuth } from '@/contexts/AuthContext';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateListRequest) => void;
}

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500', colorHex: '#3B82F6' },
  { value: 'green', label: 'Green', class: 'bg-green-500', colorHex: '#10B981' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500', colorHex: '#8B5CF6' },
  { value: 'red', label: 'Red', class: 'bg-red-500', colorHex: '#EF4444' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500', colorHex: '#F59E0B' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500', colorHex: '#6366F1' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500', colorHex: '#EC4899' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500', colorHex: '#14B8A6' },
];

const categoryOptions = [
  { value: 'PERSONAL', label: 'Personal', icon: '👤' },
  { value: 'WORK', label: 'Work', icon: '💼' },
  { value: 'STUDY', label: 'Study', icon: '📚' },
  { value: 'OTHER', label: 'Other', icon: '📂' },
] as const;

export default function CreateListModal({ isOpen, onClose, onSubmit }: CreateListModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateListRequest>({
    listTitle: '',
    listDescription: '',
    listCategory: 'PERSONAL',
    color: 'blue',
    username: user?.username || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CreateListRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.listTitle.trim()) {
      newErrors.listTitle = 'List title is required';
    } else if (formData.listTitle.trim().length < 3) {
      newErrors.listTitle = 'List title must be at least 3 characters long';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
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
      await onSubmit({
        ...formData,
        listTitle: formData.listTitle.trim(),
        listDescription: formData.listDescription?.trim() || undefined,
      });
      
      // Reset form and close modal
      setFormData({
        listTitle: '',
        listDescription: '',
        listCategory: 'PERSONAL',
        color: 'blue',
        username: user?.username || '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        listTitle: '',
        listDescription: '',
        listCategory: 'PERSONAL',
        color: 'blue',
        username: user?.username || '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New List
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* List Title */}
            <div>
              <label htmlFor="listTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                List Title *
              </label>
              <input
                type="text"
                id="listTitle"
                value={formData.listTitle}
                onChange={(e) => handleChange('listTitle', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.listTitle 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter list title..."
                disabled={isSubmitting}
              />
              {errors.listTitle && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.listTitle}</p>
              )}
            </div>

            {/* List Description */}
            <div>
              <label htmlFor="listDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="listDescription"
                rows={3}
                value={formData.listDescription}
                onChange={(e) => handleChange('listDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe what this list is for..."
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categoryOptions.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleChange('listCategory', category.value)}
                    disabled={isSubmitting}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      formData.listCategory === category.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    } disabled:opacity-50`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Theme
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.colorHex)}
                    disabled={isSubmitting}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.color === color.colorHex
                        ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } disabled:opacity-50`}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
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
                    <span>Create List</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
