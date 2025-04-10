import type { VirtualElement, VirtualElementType } from './types';
import { hasSome, isNil } from '@powwow-js/core';

export const isVirtualElement = (element: unknown): element is VirtualElement => typeof element === 'object';

export const createVirtualTextElement = (text: string): VirtualElement => {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
    },
  };
};

const isFalsyElement = (child: unknown): boolean => isNil(child) || child === false;

export const createVirtualElement = (
  type: VirtualElementType,
  props: Record<string, unknown> = {},
  ...child: (unknown | VirtualElement)[]
): VirtualElement => {
  const children = child.map((c) =>
    isVirtualElement(c) ? c : isFalsyElement(c) ? null : createVirtualTextElement(String(c))
  );

  return {
    type,
    props: {
      ...props,
      children: children.filter((c) => hasSome(c)),
    },
  };
};

// Support React.Fragment syntax.
export const Fragment = Symbol.for('react.fragment') as unknown as (props: unknown) => never;
