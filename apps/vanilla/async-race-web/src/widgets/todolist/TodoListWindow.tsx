import { WndTitleBar } from '../../components/WndTitleBar';
import { WndBody } from '../../components/WndBody';
import { TabList } from '../../components/TabList';
import { TabListItem } from '../../components/TabListItem';
import { WndStatusBar } from '../../components/WndStatusBar';
import { WndView } from '../../components/WndView';
import { TodoListAsync } from './TodoListAsync';

export const TodoListWindow = () => {
  return (
    <WndView styles={{ minWidth: '730px' }}>
      <WndTitleBar caption='Reely TodoList(s)' />
      <WndBody>
        <TabList>
          <TabListItem caption='Asynchronous version' selected />
          <TabListItem caption='Synchronious version' />
        </TabList>
        <article role='tabpanel' id='todolist-async'>
          <p>
            Inspect the <code>Asynchronous</code> ✔️ todolist available functionality
          </p>
          <TodoListAsync />
        </article>
      </WndBody>
      <WndStatusBar items={['Press F1 for help', 'Slide 1', 'CPU Usage: 14%']} />
    </WndView>
  );
};
