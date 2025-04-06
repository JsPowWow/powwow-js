import { Checkbox } from '../../components/Checkbox';

import { ToDoItem } from './store/types';

export interface TodoItemProps {
  item: ToDoItem;
  onSelectionChange: ({ item, selected }: { item: ToDoItem; selected: boolean }) => void;
}

export const TodoItem = ({ item, onSelectionChange }: TodoItemProps) => {
  return (
    <Checkbox
      id={`todo-item-${item.id}`}
      label={item.title}
      selected={item.completed}
      onChange={(selected) => onSelectionChange({ item, selected })}
    />
  );
};
