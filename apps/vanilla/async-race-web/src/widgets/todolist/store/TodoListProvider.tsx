import { Reely } from '@pw-internals/jsx-runtime';
import { ToDoItem } from './types';

interface TodoListProviderProps {
  items: ToDoItem[];
  children?: unknown[];
}

export const TodoListStoreContext = Reely.createContext<{ items: ToDoItem[] }>({ items: [] });

export const TodoListProvider = ({ items, children }: TodoListProviderProps) => {
  const contextValue = Reely.useMemo(() => ({ items }), [items]);
  return <TodoListStoreContext.Provider value={contextValue}>{children}</TodoListStoreContext.Provider>;
};
