import type { FiberNode, FiberNodeDOM, VirtualElementProps } from './types';
import { isBoolean, isInstanceOf, isNumber, isString } from '@powwow-js/core';
import { setStyles } from './utils';

const defaultPropertyKeys = 'children';

export const updateDOM = (
  DOM: NonNullable<FiberNodeDOM>,
  previousProps: VirtualElementProps,
  nextProps: VirtualElementProps
): void => {
  for (const [removePropertyKey, removePropertyValue] of Object.entries(previousProps)) {
    if (removePropertyKey.startsWith('on')) {
      DOM.removeEventListener(removePropertyKey.slice(2).toLowerCase(), removePropertyValue as EventListener);
    } else if (removePropertyKey !== defaultPropertyKeys && isInstanceOf(Element, DOM)) {
      DOM.removeAttribute(removePropertyKey);
    }
  }

  for (const [addPropertyKey, addPropertyValue] of Object.entries(nextProps)) {
    if (addPropertyKey.startsWith('on')) {
      DOM.addEventListener(addPropertyKey.slice(2).toLowerCase(), addPropertyValue as EventListener);
    } else if (addPropertyKey !== defaultPropertyKeys) {
      Object.assign(DOM, { [addPropertyKey]: addPropertyValue });

      switch (true) {
        case isInstanceOf(HTMLElement, DOM) && addPropertyKey === 'styles': {
          setStyles(DOM, addPropertyValue as CSSStyleDeclaration);
          break;
        }
        case isInstanceOf(Element, DOM) &&
          (isString(addPropertyValue) || isNumber(addPropertyValue) || isBoolean(addPropertyValue)): {
          DOM.setAttribute(addPropertyKey, String(addPropertyValue));
          break;
        }
      }
    }
  }
};

export const createDOM = (fiberNode: FiberNode): FiberNodeDOM => {
  const { type, props } = fiberNode;
  let DOM: FiberNodeDOM = null;

  if (type === 'TEXT') {
    DOM = document.createTextNode('');
  } else if (typeof type === 'string') {
    DOM = document.createElement(type);
  }

  // Update properties based on props after creation.
  if (DOM !== null) {
    updateDOM(DOM, {}, props);
  }

  return DOM;
};
