import { useFetchData } from './useFetchData';
import { IndeterminateProgress } from '../../components/IndeterminateProgress';
import { hasSome } from '@powwow-js/core';
import { ProgressBar } from '../../components/ProgressBar';
import { WndStatusBar } from '../../components/WndStatusBar';
import { Reely } from '@pw-internals/jsx-runtime';
import { WndBody } from '../../components/WndBody';
import { useTodoListStore } from './store/useTodoListStore';
import { useRerender } from './useRerender';
import { TodoListTableView, TodoListTableViewProps } from './TodoListTableView';
import { ToDoItem } from './store/types';
import { selectors } from './store/selectors';

const dataFetcher = (key: unknown) => fetch(`https://jsonplaceholder.typicode.com/todos?uid=${key}`);

export const TodoListAsync = () => {
  const [reload, times] = useRerender();
  const { isLoading, data, error } = useFetchData<ToDoItem[]>(times, dataFetcher);

  const { store, useSelector } = useTodoListStore(data);

  // console.log({ isLoading, data, error, store });

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

  const totalItems = useSelector(selectors.getTotalItems);
  const totalSelected = useSelector(selectors.getTotalSelectedItems);

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
        <TodoListTableView
          items={store.context.get().todos}
          onItemSelectionChange={handleItemSelectionChange}
          onItemDelete={handleItemDelete}
        />
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
