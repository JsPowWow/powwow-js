import { isSomeFunction, isString } from '@powwow-js/core';

type Component = (props: Record<string, unknown>) => unknown;

export default function createElementNaive(
  component: string | Component,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): unknown {
  if (!props) props = {};

  props['children'] = children.flat(Infinity);

  if (typeof component === 'function') return component(props);

  const element = document.createElement(component);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
    else if (key === 'className' && isString(value)) element.setAttribute('class', value);
    else if (isSomeFunction(value)) Object.assign(element, { onclick: value });
    else element.setAttribute(key, String(value));
  }
  const elementChildren = Array.isArray(props['children']) ? props['children'] : [];
  element.append(...(elementChildren as Node[]));

  return element;
}
