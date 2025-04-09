import { useFetchData } from './useFetchData';
import { IndeterminateProgress } from '../../components/IndeterminateProgress';
import { hasSome, noop } from '@powwow-js/core';
import { ProgressBar } from '../../components/ProgressBar';
import { WndStatusBar } from '../../components/WndStatusBar';
import Reely from '@powwow-js/reely';
import { WndBody } from '../../components/WndBody';
import { useTodoListStore } from './store/useTodoListStore';
import { useRerender } from './useRerender';
import { TodoListTableView, TodoListTableViewProps } from './TodoListTableView';
import { ToDoItem } from './store/types';
import { selectors } from './store/selectors';
import { TodoListProvider } from './store/TodoListProvider';

const defaultTodos: ToDoItem[] = [
  { id: 1, title: 'A', completed: false },
  { id: 2, title: 'B', completed: false },
  { id: 3, title: 'С', completed: true },
  // { id: 4, title: 'Btn', completed: true },
];

const otherTodos: ToDoItem[] = [
  { id: 1, title: 'AA', completed: false },
  { id: 2, title: 'BB', completed: false },
  { id: 3, title: 'СC', completed: true },
  // { id: 4, title: 'Btn', completed: true },
];

const dataFetcher = (key: unknown) => fetch(`https://jsonplaceholder.typicode.com/todos?uid=${key}`);

export const TodoListAsync = () => {
  const [reload, times] = useRerender();
  const { isLoading, data = defaultTodos, error } = useFetchData<ToDoItem[]>(times, dataFetcher);
  const store = useTodoListStore(data);

  const handleItemSelectionChange = Reely.useCallback<TodoListTableViewProps['onItemSelectionChange']>(
    ({ item, selected }) =>
      store.send('updateTodo', {
        ...item,
        completed: selected,
      }),
    [store]
  );

  const handleItemDelete = Reely.useCallback<TodoListTableViewProps['onItemDelete']>(
    ({ item }) => {
      store.send('deleteTodo', item);
    },
    [store]
  );

  const handleReload = () => {
    store.send('clear');
    reload();
  };

  const loadingStatusRenderer = Reely.useMemo(() => {
    return (
      <ProgressBar
        variant={hasSome(error) ? 'error' : 'paused'}
        progress={100}
        styles={{ width: '100%', height: '8px' }}
      />
    );
  }, [error]);

  const totalItems = store.context.select(selectors.getTotalItems);
  const totalSelected = store.context.select(selectors.getTotalSelectedItems);

  return (
    <Reely.Fragment>
      {/*TODO AR menubar*/}
      <div>
        <button onClick={handleReload}>Load...</button>
      </div>

      <WndBody
        styles={{
          margin: '0px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.07rem',
          width: '100%',
          height: '220px',
          overflow: 'auto',
        }}
        className='has-scrollbar'
      >
        <TodoListProvider items={otherTodos}>
          <TodoListTableView onItemSelectionChange={noop} onItemDelete={noop} id='otherTodos' />
        </TodoListProvider>

        <TodoListProvider items={store.context.get().todos}>
          <TodoListTableView
            onItemSelectionChange={handleItemSelectionChange}
            onItemDelete={handleItemDelete}
            id='todos'
          />
        </TodoListProvider>
        {/*{store.context.get().todos.map((todoItem) => (*/}
        {/*  <TodoItem item={todoItem} />*/}
        {/*))}*/}
      </WndBody>
      <WndStatusBar
        styles={{ margin: '0px', width: '100%' }}
        items={[
          hasSome(error) ? error.message : null,
          `Total: ${totalItems}`,
          `Total ✔️: ${totalSelected}`,
          isLoading ? <IndeterminateProgress styles={{ width: '100%', height: '8px' }} /> : loadingStatusRenderer,
        ].filter(Boolean)}
      />
    </Reely.Fragment>
  );
  //}
};
