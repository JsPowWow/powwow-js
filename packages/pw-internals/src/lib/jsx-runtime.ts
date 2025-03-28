import createVDomElement from './jsx-vdom/jsxPragmaVdom';
import NaiveDom from './jsx-naive/NaiveDom';
import { MiniDom } from '../index';
// import type { VirtualElement } from './jsx-mini/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, unknown>>;
    // type Element = VirtualElement | ((props: Record<string, unknown>) => VirtualElement);
    type Element = unknown;
  }
}

type JsxRuntimeMode = 'naive' | 'vDom' | 'mini';

let currentMode: JsxRuntimeMode = 'vDom';

const jsxRuntimeMode = (): JsxRuntimeMode => currentMode;

export const jsx = {
  jsxRuntimeMode,
  setJsxRuntimeMode: (mode: JsxRuntimeMode): JsxRuntimeMode => (currentMode = mode),
  component: (...parameters: unknown[]): unknown => {
    switch (jsxRuntimeMode()) {
      case 'naive': {
        return NaiveDom.createElement(...(parameters as Parameters<typeof NaiveDom.createElement>));
      }
      case 'vDom': {
        return createVDomElement(...(parameters as Parameters<typeof createVDomElement>));
      }
      case 'mini': {
        return MiniDom.createElement(...(parameters as Parameters<typeof MiniDom.createElement>));
      }
    }
  },
};
