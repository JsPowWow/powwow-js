import { assertIsNonNullable, isNumber, isSomeFunction, isString, VariadicFunction } from '@powwow-js/core';
import { createComponent, createElement, createText, VDomNode } from './vdom';
import { ClassComponentType, isClassComponentType } from './ClassComponent';

declare global {
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
  }
}

export const jsx = {
  component(
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

    const elementChildren = Array.isArray(props['children']) ? props['children'] : [];

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
  },
};
