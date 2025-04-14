import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { ToDoItem, TodoListState, TodoListTransitions } from './types';
import { TodoListDataContext } from './logic';

export const emptyTodos: ToDoItem[] = [];

export const reducers: StateMachineTransitionActionEffect<TodoListTransitions, TodoListState, TodoListDataContext> = (
  action
) =>
  matchAction(action)
    .when({ by: 'setTodos' }, ({ context, data }) => context.set({ todos: data.items }))
    .when({ by: 'updateTodo' }, ({ context, data: newItem }) => {
      context.set((previousState) => ({
        ...previousState,
        todos: [...previousState.todos.filter(({ id: itemId }) => itemId !== newItem.id), newItem],
      }));
    })
    .when({ by: 'deleteTodo' }, ({ context, data: newItem }) => {
      context.set((previousState) => {
        return { ...previousState, todos: previousState.todos.filter(({ id: itemId }) => itemId !== newItem.id) };
      });
    })
    .when({ by: 'clear' }, ({ context }) => context.set({ todos: emptyTodos }));
