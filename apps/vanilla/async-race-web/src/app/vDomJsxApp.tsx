import { vDom } from '@pw-internals/jsx-runtime';
import { ToDoJSX } from '../pages/testPage/ToDoJSX';
import { ToDoHyper } from '../pages/testPage/ToDoHyper';
import { NaiveJsxApp } from './NaiveJsxApp';

export class VDomJsxApp extends vDom.ClassComponent {
  render = () => (
    <main className='app'>
      <NaiveJsxApp />
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
//
// function Example() {
//   return (
//     <div className='test'>
//       Hello, World!
//       <br />
//       <button onclick="alert('Hello, There!')">Click Me!</button>
//     </div>
//   );
// }
//
// const app = document.getElementById('root');
// app?.append(<Example />);
