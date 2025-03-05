import axios from "axios";

import { Task } from '../models/models';

const API_URL = "http://localhost:8000"; // Change this for deployment

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

// Add a new task
export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  console.log(task);
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

// Update a task
export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${task.id}`, task);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};