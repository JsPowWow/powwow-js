import { assertIsNonNullable } from '@powwow-js/core';
import Reely from '@powwow-js/reely';
import { App } from './app/App';
import { setup } from './app/appSetup';

const root = document.querySelector<HTMLDivElement>('#root');
assertIsNonNullable(root);

Reely.render(
  <main className='main'>
    <App />
  </main>,
  root
);

setup();
