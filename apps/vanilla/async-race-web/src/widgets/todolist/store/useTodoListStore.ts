import Reely from '@powwow-js/reely';
import { StateMachine } from '@powwow-js/state-machine';
import { ObjectStore } from '@powwow-js/simple-store';
import { useRerender } from '../useRerender';
import { todoListLogic } from './logic';
import { emptyTodos } from './reducers';
import { ToDoItem, TodoListData } from './types';
import { Nullable } from '@powwow-js/core';

const store = new StateMachine(todoListLogic, new ObjectStore<TodoListData>({ todos: emptyTodos }));

export const useTodoListStore = (todos: ToDoItem[] | undefined = emptyTodos) => {
  const [rerender] = useRerender();

  // const store = Reely.useMemo(() => {
  //   //console.log('useTodoListStore: create');
  //   return new StateMachine(todoListLogic, new ObjectStore<TodoListData>({ todos: defaultTodos }));
  // }, []);

  Reely.useEffect(() => {
    // NOTE: or
    // store.on('stateChanged', rerender);
    // return () => {
    //   store.off('stateChanged', rerender);
    // };
    store.context.on('changed', rerender);
    return () => {
      store.context.off('changed', rerender);
    };
  }, []);

  const previousTodos = Reely.useRef<Nullable<ToDoItem[]>>(null);

  Reely.useEffect(() => {
    if (todos !== previousTodos.current) {
      previousTodos.current = todos;
      store.send('setTodos', { items: todos });
    }
  }, [todos]);

  return store;
};
