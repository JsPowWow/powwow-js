import { ToDoItem } from './types';
import { TodoItem } from './TodoItem';
import { cn } from './cn';
import { useSort } from './useSort';
import { Reely } from '@pw-internals/jsx-runtime';

interface Props {
  items: ToDoItem[];
}

export const TodoListTableView = ({ items }: Props) => {
  const [todos, setTodos] = Reely.useState(items);

  const { sortKey, handleSortKeyChange, sortDirection } = useSort({
    data: items,
    onSortChange: setTodos,
    sortOptions: [
      { label: 'Id', value: 'id' },
      { label: 'Title', value: 'title' },
    ],
  });

  return (
    <table class='has-shadow' style='width: 100%'>
      <thead>
        <tr>
          <th
            style='z-index: 100'
            onclick={() => handleSortKeyChange('title')}
            class={cn(
              { highlighted: sortKey === 'title' },
              { indicator: sortKey === 'title' },
              { up: sortDirection === 'asc' }
            )}
          >
            Name
          </th>
          <th
            style='z-index: 100'
            onclick={() => handleSortKeyChange('id')}
            class={cn(
              { highlighted: sortKey === 'id' },
              { indicator: sortKey === 'id' },
              { up: sortDirection === 'asc' }
            )}
          >
            id
          </th>
          <th style='z-index: 100; width: 60px'></th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todoItem) => {
          // TODO AR bugged on sort, delete/append wrong order
          // if (todoItem.title === 'Btn') {
          //   return (
          //     <span>
          //       {todoItem.title}
          //       {todoItem.id}
          //     </span>
          //   );
          // }

          return (
            <tr>
              <td>{<TodoItem item={todoItem} />}</td>
              <td>{todoItem.id}</td>
              <td>...</td>
            </tr>
            // <TodoItem item={todoItem} />
          );
        })}
      </tbody>
    </table>
  );
};
