"use client";

import React from 'react';

import { Task } from '../models/models';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onDeleteTask }) {

  if (tasks === null) {
    return <p>Loading...</p>; // ✅ Prevents hydration mismatch
  }

  const tasksWithIds = tasks.map((task, index) => ({
    ...task,
    id: task.id || `temp-id-${index}`, // Generate a UUID for missing IDs
  }));

  return (
    <div className="max-h-96 overflow-y-auto w-[70vw]">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">My Tasks</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {tasksWithIds.map((task) => (
          <TaskItem
            task={task}
            key={task.id}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ul>
    </div>
  );
};
