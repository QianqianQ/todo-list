export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskItemProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}