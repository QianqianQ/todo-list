export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (task: Task) => void;
}

export interface TaskItemProps {
  task: Task;
  onDeleteTask: (task: Task) => void;
}