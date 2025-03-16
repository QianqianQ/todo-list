"use client";

import { useState } from "react";
import manageTasks from "@/hooks/manageTask";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskModal from './TaskModal';

export default function HomePage() {

  const { tasks, handleAddTask, handleDeleteTask } = manageTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6">
          Add Task
        </button>
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
       />
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      </TaskModal>
    </div>
  );
}
