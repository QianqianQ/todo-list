import { useEffect, useState } from 'react';

import { Task } from '@/models/models';
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/api';

const manageTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.log('Failed to fetch tasks.');
      }
    };
    loadTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (title: string) => {
    try {
      const newTask = await addTask({ title, completed: false });
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.log('Failed to add task.');
    }
  };

  // Update a task
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (err) {
      console.log('Failed to update task.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.log('Failed to delete task.');
    }
  };

  return { tasks, handleAddTask, handleUpdateTask, handleDeleteTask };
};

export default manageTasks;