import axios from "axios";

import { Task } from '../models/models';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${apiUrl}/tasks`);
  return response.data;
};

// Add a new task
export const addTask = async (task: Task): Promise<Task> => {
  console.log(task);
  const response = await axios.post(`${apiUrl}/tasks`, task);
  return response.data;
};

// Update a task
export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${apiUrl}/tasks/${task.id}`, task);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/tasks/${id}`);
};