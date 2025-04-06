export type TodoListState = 'todos';

export interface ToDoItem {
  id: number;
  title: string;
  completed: boolean;
}

export type TodoListTransitions = {
  setTodos: {
    items: ToDoItem[];
  };
  updateTodo: ToDoItem;
  deleteTodo: ToDoItem;
  clear: undefined;
};

export type TodoListData = {
  todos: ToDoItem[];
};
