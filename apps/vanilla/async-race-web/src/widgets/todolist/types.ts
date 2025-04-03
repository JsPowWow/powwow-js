export interface ToDoItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface ToDoState {
  items: ToDoItem[];
}
