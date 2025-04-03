import { TodoListWindow } from '../../../widgets/todolist/TodoListWindow';

export const AppsExamplesItem = () => {
  return (
    <details open>
      <summary>{`Small 👾 apps creation is easy`}</summary>
      <ul style='border-left: 1px solid #808080'>
        <li>
          <details open>
            <summary>☑️ Todolist Demo(s)</summary>
            <TodoListWindow />
          </details>
        </li>
        <li>Functional Components</li>
        <li>Class Components</li>
      </ul>
    </details>
  );
};
