"use client";

import React from 'react';

import { TaskListProps } from '../models/models';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onDeleteTask }: TaskListProps) {

  if (tasks === null) {
    return <p>Loading...</p>; // ✅ Prevents hydration mismatch
  }

  return (
    <div className="max-h-screen overflow-y-auto w-[70vw]">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">My Tasks</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
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
