"use client";

import { Task, TaskItemProps } from '../models/models';
import { useState } from 'react';

const TaskItem = ({ task, onUpdateTask, onDeleteTask }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);

  const handleSave = () => {
    onUpdateTask({ ...task, title });
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <button onClick={() => onDeleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default TaskItem;