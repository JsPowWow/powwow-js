import { createComponent, renderDOM } from '@pw-internals/jsx-runtime';
import { App } from './app';

renderDOM('root', createComponent(App, { key: 'app' }));
