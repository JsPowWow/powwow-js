import { assertIsNonNullable } from '@powwow-js/core';
import Reely from '@powwow-js/reely';
import { App } from './app/App';
import { setupScene } from './scene';

const root = document.querySelector<HTMLDivElement>('#root');
assertIsNonNullable(root);

setupScene();

Reely.render(
  <main className='main'>
    <App />
  </main>,
  root
);
