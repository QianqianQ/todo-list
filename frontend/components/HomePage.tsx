"use client";

import TaskList from "./TaskList";
import TaskForm from "@/components/TaskForm";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Task Management Dashboard</h1>
      <TaskList />
      <TaskForm />
    </div>
  );
}
