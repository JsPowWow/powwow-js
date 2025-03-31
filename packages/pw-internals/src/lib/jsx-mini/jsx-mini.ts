import { hasSome, isInstanceOf, isSomeFunction } from '@powwow-js/core';

import { ComponentFunction, FiberNode, FiberNodeDOM, VirtualElement } from './types';
import { isComponentType } from './Component';
import { createVirtualTextElement, Fragment, isVirtualElement } from './vDom';
import { createDOM, updateDOM } from './rDom';
import { useState } from './hooks/state';
import { $$reely } from './renderContext';
import { findChildFiber, findParentFiber } from './fiber';

// Initial or reset.
export const render = (element: VirtualElement, container: Element): void => {
  $$reely.currentRoot = null;
  $$reely.wipRoot = {
    type: 'div',
    dom: container,
    props: {
      children: [{ ...element }],
    },
    alternate: $$reely.currentRoot,
  };
  $$reely.nextUnitOfWork = $$reely.wipRoot;
  $$reely.deletions = [];
};

// Note that we must complete the comparison of all fiber nodes before commitRoot.
// The comparison of fiber nodes can be interrupted, but the commitRoot cannot be interrupted.
const commitRoot = () => {
  const commitDeletion = (parentDOM: FiberNodeDOM, DOM: NonNullable<FiberNodeDOM>) => {
    if (hasSome(parentDOM)) {
      DOM.remove();
    }
  };

  const commitReplacement = (parentDOM: FiberNodeDOM, DOM: NonNullable<FiberNodeDOM>) => {
    if (hasSome(parentDOM) && isInstanceOf(Element, parentDOM)) {
      parentDOM.append(DOM);
    }
  };

  const commitWork = (fiberNode?: FiberNode): void => {
    if (fiberNode) {
      if (fiberNode.dom) {
        const parentFiber = findParentFiber(fiberNode);
        const parentDOM = parentFiber?.dom;

        switch (fiberNode.effectTag) {
          case 'REPLACEMENT': {
            commitReplacement(parentDOM, fiberNode.dom);
            break;
          }
          case 'UPDATE': {
            updateDOM(fiberNode.dom, fiberNode.alternate ? fiberNode.alternate.props : {}, fiberNode.props);
            break;
          }
          default: {
            break;
          }
        }
      }

      commitWork(fiberNode.child);
      commitWork(fiberNode.sibling);
    }
  };

  for (const deletion of $$reely.deletions) {
    const parentFiber = findParentFiber(deletion);
    if (deletion.dom) {
      commitDeletion(parentFiber?.dom, deletion.dom);
    } else if (isSomeFunction(deletion.type)) {
      const childFiber = findChildFiber(deletion);
      if (childFiber?.dom) {
        commitDeletion(parentFiber?.dom, childFiber.dom);
      }
    }
  }

  if (hasSome($$reely.wipRoot)) {
    commitWork($$reely.wipRoot.child);
    $$reely.currentRoot = $$reely.wipRoot;
  }

  $$reely.wipRoot = null;
};

// Reconcile the fiber nodes before and after, compare and record the differences.
const reconcileChildren = (fiberNode: FiberNode, elements: VirtualElement[] = []) => {
  let index = 0;
  let oldFiberNode: FiberNode | undefined = void 0;
  let previousSibling: FiberNode | undefined = void 0;
  const virtualElements = elements.flat(Infinity);

  if (fiberNode.alternate?.child) {
    oldFiberNode = fiberNode.alternate.child;
  }

  while (index < virtualElements.length || oldFiberNode !== undefined) {
    const virtualElement = virtualElements[index];
    let newFiber: FiberNode | undefined = void 0;

    const isSameType = Boolean(oldFiberNode && virtualElement && oldFiberNode.type === virtualElement.type);

    if (isSameType && oldFiberNode) {
      newFiber = {
        type: oldFiberNode.type,
        dom: oldFiberNode.dom,
        alternate: oldFiberNode,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'UPDATE',
      };
    }

    if (!isSameType && Boolean(virtualElement)) {
      newFiber = {
        type: virtualElement.type,
        dom: null,
        alternate: null,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'REPLACEMENT',
      };
    }

    if (!isSameType && oldFiberNode) {
      $$reely.deletions.push(oldFiberNode);
    }

    if (oldFiberNode) {
      oldFiberNode = oldFiberNode.sibling;
    }

    if (index === 0) {
      fiberNode.child = newFiber;
    } else if (previousSibling !== undefined) {
      previousSibling.sibling = newFiber;
    }

    previousSibling = newFiber;
    index += 1;
  }
};

// Execute each unit task and return to the next unit task.
// Different processing according to the type of fiber node.
const performUnitOfWork = (fiberNode: FiberNode): FiberNode | null => {
  const { type } = fiberNode;

  switch (typeof type) {
    case 'function': {
      $$reely.wipFiber = fiberNode;
      $$reely.wipFiber.hooks = [];
      $$reely.hookIndex = 0;
      let children: ReturnType<ComponentFunction>;

      if (isComponentType(type)) {
        const component = new type(fiberNode.props);
        const [state, setState] = useState(component.state);
        component.props = fiberNode.props;
        component.state = state;
        component.setState = setState;
        children = component.render.bind(component)() as VirtualElement;
      } else {
        children = type(fiberNode.props);
      }
      reconcileChildren(fiberNode, [
        isVirtualElement(children) ? children : createVirtualTextElement(String(children)),
      ]);
      break;
    }

    case 'number':
    case 'string': {
      if (!fiberNode.dom) {
        fiberNode.dom = createDOM(fiberNode);
      }
      reconcileChildren(fiberNode, fiberNode.props.children);
      break;
    }
    case 'symbol': {
      if (type === Fragment) {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;
    }
    default: {
      if (fiberNode.props !== undefined) {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;
    }
  }

  if (fiberNode.child) {
    return fiberNode.child;
  }

  let nextFiberNode: FiberNode | undefined = fiberNode;

  while (nextFiberNode !== undefined) {
    if (nextFiberNode.sibling) {
      return nextFiberNode.sibling;
    }

    nextFiberNode = nextFiberNode.return;
  }

  return null;
};

// Use requestIdleCallback to query whether there is currently a unit task
// and determine whether the DOM needs to be updated.
const workLoop: IdleRequestCallback = (deadline) => {
  while ($$reely.nextUnitOfWork && deadline.timeRemaining() > 1) {
    $$reely.nextUnitOfWork = performUnitOfWork($$reely.nextUnitOfWork);
  }

  if (!$$reely.nextUnitOfWork && $$reely.wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
};

// Start the engine!
void (function main(): void {
  window.requestIdleCallback(workLoop);
})();
