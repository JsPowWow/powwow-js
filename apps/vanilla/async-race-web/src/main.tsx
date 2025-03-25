import { vDom, jsx as jsxRuntime } from '@pw-internals/jsx-runtime';
import { VDomJsxApp } from './app/vDomJsxApp';
import { assertIsNonNullable, exhaustiveGuard } from '@powwow-js/core';
import { NaiveJsxApp } from './app/NaiveJsxApp';

const renderMode = jsxRuntime.setJsxRuntimeMode('vDom');

switch (renderMode) {
  case 'naive': {
    const root = document.querySelector<HTMLDivElement>('#root');
    assertIsNonNullable(root);
    root.append(<NaiveJsxApp />);
    break;
  }
  case 'vDom': {
    vDom.renderDOM('root', vDom.createComponent(VDomJsxApp, { key: 'app' }));
    break;
  }
  default: {
    exhaustiveGuard(renderMode);
  }
}
