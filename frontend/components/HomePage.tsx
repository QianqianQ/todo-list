"use client";

import manageTasks from "@/hooks/manageTask";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";

export default function HomePage() {

  const { tasks, handleAddTask, handleDeleteTask } = manageTasks();

  return (
    <div>
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
      </div>
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
       />
      <TaskForm onAddTask={handleAddTask} />
    </div>
  );
}
