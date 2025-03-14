import axios from "axios";

import { Task } from '../models/models';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiUrl = `${apiBaseUrl}/tasks`;

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(apiUrl);
  return response.data;
};

// Add a new task
export const addTask = async (task: Task): Promise<Task> => {
  console.log(task);
  const response = await axios.post(apiUrl, task);
  return response.data;
};

// Update a task
export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${apiUrl}/${task.id}`, task);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/${id}`);
};