"use client";

import { TaskItemProps } from '../models/models';
// import { useState } from 'react';

const TaskItem = ({ task, onDeleteTask }: TaskItemProps) => {
  // const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [title, setTitle] = useState<string>(task.title);

  return (
    <li key={task.id} className="group flex items-center p-4 hover:bg-gray-50 transition-all duration-200">
      <div className="flex-shrink-0 mr-3">
        <div className="h-5 w-5 border-2 border-gray-300 rounded-full group-hover:border-blue-500 cursor-pointer" />
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{task.title}</p>
        {/* {task.description && (
          <p className="text-gray-500 text-sm mt-1">{task.description}</p>
        )} */}
      </div>
      <div onClick={() => onDeleteTask(task)}
        className="flex-shrink-0 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
    </li>
  );
};

export default TaskItem;