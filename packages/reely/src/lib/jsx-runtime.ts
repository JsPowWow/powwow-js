import { createVirtualElement } from './vDom';

// type JSXNode = RenderedNode | RawContentNode | (() => JSXNode) | boolean | number | bigint | string | null | undefined;

// interface RawContentNode {
//   htmlContent: string;
// }

// export type FunctionComponent = (
//   props: Record<string, unknown>
// ) => RenderedNode;

// Class to hold the result, required to differentiate
// between a string coming from outside versus already rendered jsx
// Required to handle escaping correctly
// export class RenderedNode {
//   public constructor(public readonly string: string) {}
// }

declare global {
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, unknown>>;
    // type Element = VirtualElement | ((props: Record<string, unknown>) => VirtualElement);
    // type Element = JSXNode;
  }
}

export const jsx = createVirtualElement;
