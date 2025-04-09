import { assertIsNonNullable } from '@powwow-js/core';
import Reely from '@powwow-js/reely';
import { App } from './app/App';

const root = document.querySelector<HTMLDivElement>('#root');
assertIsNonNullable(root);

Reely.render(
  <main>
    <App />
  </main>,
  root
);
