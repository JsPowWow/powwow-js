import { StateMachineDefinition } from '@powwow-js/state-machine';
import { reducers } from './reducers';
import { TodoListData, TodoListState, TodoListTransitions } from './types';
import { ObjectStore } from '@powwow-js/simple-store';

export type TodoListDataContext = ObjectStore<TodoListData>;

export const todoListLogic: StateMachineDefinition<TodoListState, TodoListTransitions, TodoListDataContext> = {
  initialState: 'todos',
  debug: true,
  states: {
    todos: {
      transitions: {
        setTodos: {
          target: 'todos',
          action: reducers,
        },
        updateTodo: {
          target: 'todos',
          action: reducers,
        },
        deleteTodo: {
          target: 'todos',
          action: reducers,
        },
        clear: {
          target: 'todos',
          action: reducers,
        },
      },
    },
  },
};
