import { ToDoItem } from './types';
import { Reely } from '@pw-internals/jsx-runtime';
import {
  StateMachine,
  StateMachineDefinition,
  type StateMachineTransitionActionEffect,
} from '@powwow-js/state-machine';
import { ObjectStore } from '@powwow-js/simple-store';
import { useRerender } from './useRerender';

type TodoListState = 'init' | 'todos';

type TodoListTransitions = {
  update: {
    items: ToDoItem[];
  };
  clear: undefined;
};

type TodoListData = {
  todos: ToDoItem[];
};

type TodoListDataContext = ObjectStore<TodoListData>;

const emptyTodos: ToDoItem[] = [];

const updateTodos: StateMachineTransitionActionEffect<TodoListTransitions, TodoListState, TodoListDataContext> = ({
  owner,
  data,
}) => data && owner.context.set({ todos: data.items });

const todoListLogic: StateMachineDefinition<TodoListState, TodoListTransitions, TodoListDataContext> = {
  initialState: 'init',
  debug: true,
  states: {
    init: {
      transitions: {
        update: {
          target: 'todos',
          action: updateTodos,
        },
      },
    },
    todos: {
      transitions: {
        update: {
          target: 'todos',
          action: updateTodos,
        },
        clear: {
          target: 'todos',
          action: ({ owner }) => {
            owner.context.set({ todos: emptyTodos });
          },
        },
      },
    },
  },
};

export const useTodoListStore = (todos: ToDoItem[] | undefined = emptyTodos) => {
  const [rerender] = useRerender();

  const store = Reely.useMemo(() => {
    console.log('useTodoListStore: create');
    return new StateMachine(todoListLogic, new ObjectStore<TodoListData>({ todos: emptyTodos }));
  }, []);

  Reely.useEffect(() => {
    store.on('stateChanged', rerender);
    return () => {
      store.off('stateChanged', rerender);
    };
    // or
    // store.context.on('changed', rerender);
    // return () => {
    //   store.context.off('changed', rerender);
    // };
  }, [store]);

  const previousTodos = Reely.useRef(todos);

  Reely.useEffect(() => {
    if (todos !== previousTodos.current) {
      // console.log('useTodoListStore: resets by', todos);
      store.send('update', { items: todos });
    }
  }, [store, todos]);

  return store;
};
