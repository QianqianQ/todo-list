import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
      const newTask = await addTask({ title, id: uuidv4(), completed: false });
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
  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));
    } catch (err) {
      console.log('Failed to delete task.');
    }
  };

  return { tasks, handleAddTask, handleDeleteTask };
};

export default manageTasks;