"use client";

import { useState } from 'react';
import { addTask } from '../services/api';
import { Task } from '../models/models';

const TaskForm = () => {
  const [title, setTitle] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await addTask({ title, completed: false });
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.log('Failed to add task.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    handleAddTask(title);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;