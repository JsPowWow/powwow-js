import { App } from './app';
import { assertIsNonNullable } from '@powwow-js/core';
const app = document.querySelector<HTMLDivElement>('#app');

assertIsNonNullable(app);
app.append(App);
