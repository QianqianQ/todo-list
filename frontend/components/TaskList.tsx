"use client";

import React, { useEffect, useState } from 'react';

import { Task } from '../models/models';
import { fetchTasks } from '../services/api';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  if (tasks === null) {
    return <p>Loading...</p>; // ✅ Prevents hydration mismatch
  }

  const tasksWithIds = tasks.map((task, index) => ({
    ...task,
    id: task.id || `temp-id-${index}`, // Generate a UUID for missing IDs
  }));
  return (
    <ul>
      {tasksWithIds.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
};
