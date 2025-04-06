import { Reely } from '@pw-internals/jsx-runtime';
import { StateMachine } from '@powwow-js/state-machine';
import { ObjectStore } from '@powwow-js/simple-store';
import { useRerender } from '../useRerender';
import { todoListLogic } from './logic';
import { emptyTodos } from './reducers';
import { ToDoItem, TodoListData } from './types';
import { withSelector } from './withSelector';

const defaultTodos: ToDoItem[] = [
  { id: 1, title: 'A', completed: false },
  { id: 2, title: 'B', completed: false },
  { id: 3, title: 'С', completed: true },
  // { id: 4, title: 'Btn', completed: true },
];

export const useTodoListStore = (todos: ToDoItem[] | undefined = emptyTodos) => {
  const [rerender] = useRerender();

  const store = Reely.useMemo(() => {
    //console.log('useTodoListStore: create');
    return new StateMachine(todoListLogic, new ObjectStore<TodoListData>({ todos: defaultTodos }));
  }, []);

  Reely.useEffect(() => {
    store.on('stateChanged', rerender);
    return () => {
      store.off('stateChanged', rerender);
    };
    // NOTE: or
    // store.context.on('changed', rerender);
    // return () => {
    //   store.context.off('changed', rerender);
    // };
  }, [store]);

  const previousTodos = Reely.useRef(todos);

  Reely.useEffect(() => {
    if (todos !== previousTodos.current) {
      // console.log('useTodoListStore: resets by', todos);
      store.send('setTodos', { items: todos });
    }
  }, [store, todos]);

  return {
    store,
    useSelector: <R>(selector: (s: TodoListData) => R) => withSelector(store.context.get(), selector),
  };
};
