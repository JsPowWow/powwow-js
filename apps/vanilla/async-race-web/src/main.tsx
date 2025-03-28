import { jsx as jsxRuntime, MiniDom, vDom } from '@pw-internals/jsx-runtime';
import { VDomJsxApp } from './app/vDomJsxApp';
import { assertIsNonNullable, exhaustiveGuard } from '@powwow-js/core';
import { NaiveJsxApp } from './app/NaiveJsxApp';
import TestMiniDomPage from './pages/testMiniDomPage';

const renderMode = jsxRuntime.setJsxRuntimeMode('mini');
const root = document.querySelector<HTMLDivElement>('#root');
assertIsNonNullable(root);

switch (renderMode) {
  case 'naive': {
    //root.replaceWith(<NaiveJsxApp />);
    root.replaceChildren(<NaiveJsxApp />);
    //root.replaceWith(<NaiveJsxApp />);

    // setInterval(() => {
    //   NaiveDom.$resets();
    //   root.replaceChildren(<NaiveJsxApp />);
    // }, 300);

    break;
  }
  case 'vDom': {
    vDom.renderDOM('root', vDom.createComponent(VDomJsxApp, { key: 'app' }));
    break;
  }
  case 'mini': {
    MiniDom.render(<TestMiniDomPage />, root);
    break;
  }
  default: {
    exhaustiveGuard(renderMode);
  }
}
