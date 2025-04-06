import { TodoListData } from './types';

export const selectors = {
  getTotalItems: (state: TodoListData) => state.todos.length,
  getTotalSelectedItems: (state: TodoListData) => state.todos.reduce((acc, item) => (item.completed ? ++acc : acc), 0),
};
