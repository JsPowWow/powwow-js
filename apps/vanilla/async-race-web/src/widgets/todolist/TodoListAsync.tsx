import { useFetchData } from './useFetchData';
import { IndeterminateProgress } from '../../components/IndeterminateProgress';
import { hasSome } from '@powwow-js/core';
import { ProgressBar } from '../../components/ProgressBar';
import { ToDoItem } from './types';
import { TodoItem } from './TodoItem';
import { WndStatusBar } from '../../components/WndStatusBar';
import { Reely } from '@pw-internals/jsx-runtime';
import { WndBody } from '../../components/WndBody';
import { useTodoListStore } from './useTodoListStore';
import { useRerender } from './useRerender';

export const TodoListAsync = () => {
  const [reload, times] = useRerender();
  const { isLoading, data, error } = useFetchData<ToDoItem[]>(
    `https://jsonplaceholder.typicode.com/todos?uid=${times}`
  );

  const store = useTodoListStore(data);

  console.log({ isLoading, data, error, store });

  const loadingStatusRenderer = Reely.useMemo(() => {
    return (
      <ProgressBar
        variant={hasSome(error) ? 'error' : 'paused'}
        progress={100}
        styles={{ width: '100%', height: '8px' }}
      />
    );
  }, [error]);

  const handleReload = () => {
    store.send('clear');
    reload();
  };

  return (
    <Reely.Fragment>
      {/*TODO AR menubar*/}
      <div>
        <button onClick={handleReload}>Reload...</button>
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
        {store.context.get().todos.map((todoItem) => (
          <TodoItem item={todoItem} />
        ))}
      </WndBody>
      <WndStatusBar
        styles={{ margin: '0px', width: '100%' }}
        items={[
          hasSome(error) ? error.message : `Total ${data?.length ?? 0}`,
          isLoading ? <IndeterminateProgress styles={{ width: '100%', height: '8px' }} /> : loadingStatusRenderer,
        ].filter(Boolean)}
      />
    </Reely.Fragment>
  );
  //}
};
