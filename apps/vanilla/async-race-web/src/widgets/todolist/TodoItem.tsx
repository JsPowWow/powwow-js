import { Checkbox } from '../../components/Checkbox';
import { ToDoItem } from './types';

interface Props {
  item: ToDoItem;
}

export const TodoItem = ({ item }: Props) => {
  return <Checkbox id={`todo-item-${item.id}`} label={item.title} selected={item.completed} />;
};
