import createVDomElement from './jsx-vdom/jsxPragmaVdom';
import createElementNaive from './jsx-naive/jsxPragmaNaive';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, unknown>>;
  }
}

type JsxRuntimeMode = 'naive' | 'vDom';

let currentMode: JsxRuntimeMode = 'vDom';

const jsxRuntimeMode = (): JsxRuntimeMode => currentMode;

export const jsx = {
  jsxRuntimeMode,
  setJsxRuntimeMode: (mode: JsxRuntimeMode): JsxRuntimeMode => (currentMode = mode),
  component: (...parameters: unknown[]): unknown => {
    switch (jsxRuntimeMode()) {
      case 'naive': {
        return createElementNaive(...(parameters as Parameters<typeof createElementNaive>));
      }
      case 'vDom': {
        return createVDomElement(...(parameters as Parameters<typeof createVDomElement>));
      }
    }
  },
};
