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

export interface ModalProps {
  isOpen: boolean;       // Whether the modal is open
  onClose: () => void;   // Function to close the modal
  children: React.ReactNode; // Content inside the modal
}