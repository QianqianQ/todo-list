"use client";

import { useState } from 'react';

// import { Task } from '../models/models';

const TaskForm = ({ onAddTask, onClose }: { onAddTask: (title: string) => void, onClose: () => void } ) => {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title);
    setTitle('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="taskTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="relative">
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="taskDescription"
            placeholder="Enter task description"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg mt-2"
        >
          Add New Task
        </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;