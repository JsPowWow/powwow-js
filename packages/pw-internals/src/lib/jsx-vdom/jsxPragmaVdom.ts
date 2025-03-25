import type { VariadicFunction } from '@powwow-js/core';
import { assertIsNonNullable, isNumber, isSomeFunction, isString } from '@powwow-js/core';
import type { ClassComponentType } from './ClassComponent';
import { isClassComponentType } from './ClassComponent';
import type { VDomNode } from './vdom';
import { createComponent, createElement, createText } from './vdom';

export default function createVDomElement(
  component: string | ClassComponentType,
  props: (Record<string, string | number | boolean | VariadicFunction> & { key: string }) | undefined,
  ...children: unknown[]
): VDomNode {
  if (!props) {
    props = Object.assign({});
  }

  assertIsNonNullable(props);

  Object.assign(props, { children: children.flat(Infinity) });

  if (isClassComponentType(component)) {
    const vNode = createComponent(component, props);
    assertIsNonNullable<VDomNode>(vNode);
    return vNode;
  }

  if (isSomeFunction(component)) {
    const vNode = component(props);
    assertIsNonNullable<VDomNode>(vNode);
    return vNode;
  }

  const elementChildren: VDomNode[] = Array.isArray(props['children']) ? props['children'] : [];

  return createElement(
    component,
    props,
    ...elementChildren.map((c) => {
      switch (true) {
        case isString(c) || isNumber(c): {
          return createText(c);
        }
      }
      return c;
    })
  );
}
