import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { ToDoItem, TodoListState, TodoListTransitions } from './types';
import { TodoListDataContext } from './logic';

export const emptyTodos: ToDoItem[] = [];

export const reducers: StateMachineTransitionActionEffect<TodoListTransitions, TodoListState, TodoListDataContext> = (
  action
) =>
  matchAction(action)
    .when({ by: 'setTodos' }, ({ owner, data }) => owner.context.set({ todos: data.items }))
    .when({ by: 'updateTodo' }, ({ owner, data: newItem }) => {
      owner.context.set((previousState) => ({
        ...previousState,
        todos: [...previousState.todos.filter(({ id: itemId }) => itemId !== newItem.id), newItem],
      }));
    })
    .when({ by: 'deleteTodo' }, ({ owner, data: newItem }) => {
      owner.context.set((previousState) => {
        return { ...previousState, todos: previousState.todos.filter(({ id: itemId }) => itemId !== newItem.id) };
      });
    })
    .when({ by: 'clear' }, ({ owner }) => owner.context.set({ todos: emptyTodos }));
