"use client";

import manageTasks from "@/hooks/manageTask";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";

export default function HomePage() {

  const { tasks, handleAddTask, handleUpdateTask, handleDeleteTask } = manageTasks();

  return (
    <div>
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">To Do List</h1>
      </div>
      <TaskList tasks={tasks} />
      <TaskForm onaddTask={handleAddTask} />
    </div>
  );
}
