import { Checkbox } from '../../components/Checkbox';

import { ToDoItem } from './store/types';

export interface TodoItemProps {
  id: string;
  item: ToDoItem;
  onSelectionChange: ({ item, selected }: { item: ToDoItem; selected: boolean }) => void;
}

export const TodoItem = ({ id, item, onSelectionChange }: TodoItemProps) => {
  return (
    <Checkbox
      id={`todo-item-[${id}]-${item.id}`}
      label={item.title}
      selected={item.completed}
      onChange={(selected) => onSelectionChange({ item, selected })}
    />
  );
};
