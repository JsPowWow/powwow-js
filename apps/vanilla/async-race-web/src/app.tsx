import { ClassComponent } from '@pw-internals/jsx-runtime';
import { ToDoJSX } from './pages/testPage/ToDoJSX';
import { ToDoHyper } from './pages/testPage/ToDoHyper';

export class App extends ClassComponent {
  render = () => (
    <main className='app'>
      <ToDoHyper>
        <hr key='k1' />
        <div key='k2'>{`>>> children starts <<<`}</div>
        <ToDoJSX key='kjhljkh' />
        <div key='k3'>{`>>> children ends <<<`}</div>
        <hr key='k4' />
      </ToDoHyper>
    </main>
  );
}
