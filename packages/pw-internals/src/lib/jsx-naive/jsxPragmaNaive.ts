import { isSomeFunction, isString } from '@powwow-js/core';

type FunctionalComponent = (props: Record<string, unknown>) => unknown;

const statefulElements = new Set<HTMLElement>();

export default function createElementNaive(
  component: string | FunctionalComponent,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): unknown {
  if (!props) props = {};

  props['children'] = children.flat(Infinity);

  if (typeof component === 'function') {
    return component(props);
  }

  const element = document.createElement(component);

  for (const [property, value] of Object.entries(props)) {
    if (property === 'children') continue;

    switch (true) {
      case ['className', 'class'].includes(property) && isString(value): {
        element.setAttribute('class', value);
        break;
      }
      case isSomeFunction(value): {
        // event handlers
        Object.assign(element, { onclick: value });
        break;
      }
      default: {
        element.setAttribute(property, String(value));
      }
    }
  }
  const elementChildren = Array.isArray(props['children']) ? props['children'] : [];

  element.append(...(elementChildren as Node[]));

  const pwComponentKey = element.dataset['pwComponentKey'];

  if (pwComponentKey) {
    const previousStatefulElement = [...statefulElements.values()].find(
      (element) => element.dataset['pwComponentKey'] === pwComponentKey
    );
    if (previousStatefulElement) {
      previousStatefulElement.replaceWith(element);
      statefulElements.delete(previousStatefulElement);
    }

    statefulElements.add(element);
  }

  return element;
}
