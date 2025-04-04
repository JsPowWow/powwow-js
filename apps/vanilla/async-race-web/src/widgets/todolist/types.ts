export interface ToDoItem {
  id: number;
  title: string;
  completed: boolean;
}

export interface ToDoState {
  items: ToDoItem[];
}
