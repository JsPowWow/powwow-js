import type { VirtualElement, VirtualElementType } from './types';

export const isVirtualElement = (element: unknown): element is VirtualElement => typeof element === 'object';

export const createVirtualTextElement = (text: string): VirtualElement => ({
  type: 'TEXT',
  props: {
    nodeValue: text,
  },
});

export const createVirtualElement = (
  type: VirtualElementType,
  props: Record<string, unknown> = {},
  ...child: (unknown | VirtualElement)[]
): VirtualElement => {
  const children = child.map((c) => (isVirtualElement(c) ? c : createVirtualTextElement(String(c))));

  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

// Support React.Fragment syntax.
export const Fragment = Symbol.for('react.fragment') as unknown as (props: unknown) => never;
