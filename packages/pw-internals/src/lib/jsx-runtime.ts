import { isSomeFunction } from '@powwow-js/core';

declare global {
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
  }
}

export type Component = (props: Record<string, unknown>) => any;

export const jsx = {
  component(component: string | Component, props: Record<string, any> | null, ...children: any[]) {
    if (!props) props = {};

    props['children'] = children.flat(Infinity);

    if (typeof component === 'function') return component(props);

    const element = document.createElement(component);
    for (const [key, value] of Object.entries(props)) {
      console.log('~~', key, value, typeof value);

      if (key === 'children') continue;
      else if (key === 'className') element.setAttribute('class', value);
      else if (key === 'onclick' && isSomeFunction(value)) Object.assign(element, { onclick: value });
      else element.setAttribute(key, value);
    }

    element.append(...props['children']);

    return element;
  },
};
