import { isInstanceOf, isSomeFunction } from '@powwow-js/core';

import type { ComponentFunction, FiberNode, FiberNodeDOM, Updater, UpdateStateAction, VirtualElement } from './types';
import { Component, isComponentType } from './Component';
import { isDefined, isPlainObject } from './utils';
import { createVirtualElement, createVirtualTextElement, isVirtualElement } from './vDom';
import { createDOM, updateDOM } from './rDom';

let wipRoot: FiberNode | null = null;
let nextUnitOfWork: FiberNode | null = null;
let currentRoot: FiberNode | null = null;
let deletions: FiberNode[] = [];
let wipFiber: FiberNode;
let hookIndex = 0;

// Initial or reset.
const render = (element: VirtualElement, container: Element): void => {
  currentRoot = null;
  wipRoot = {
    type: 'div',
    dom: container,
    props: {
      children: [{ ...element }],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
};

// Support React.Fragment syntax.
const Fragment = Symbol.for('react.fragment') as unknown as (props: unknown) => never;

// Enhanced requestIdleCallback.
((global: Window): void => {
  const id = 1;
  const fps = 1e3 / 60;
  let frameDeadline: number;
  let pendingCallback: IdleRequestCallback;
  const channel = new MessageChannel();
  const timeRemaining = (): number => frameDeadline - globalThis.performance.now();

  const deadline = {
    didTimeout: false,
    timeRemaining,
  };

  channel.port2.onmessage = (): void => {
    if (typeof pendingCallback === 'function') {
      pendingCallback(deadline);
    }
  };

  global.requestIdleCallback = (callback: IdleRequestCallback) => {
    global.requestAnimationFrame((frameTime) => {
      frameDeadline = frameTime + fps;
      pendingCallback = callback;
      channel.port1.postMessage(null);
    });
    return id;
  };
})(window);

// Note that we must complete the comparison of all fiber nodes before commitRoot.
// The comparison of fiber nodes can be interrupted, but the commitRoot cannot be interrupted.
const commitRoot = () => {
  const findParentFiber = (fiberNode?: FiberNode) => {
    if (fiberNode) {
      let parentFiber = fiberNode.return;
      while (parentFiber && !parentFiber.dom) {
        parentFiber = parentFiber.return;
      }
      return parentFiber;
    }

    return null;
  };

  const commitDeletion = (parentDOM: FiberNodeDOM, DOM: NonNullable<FiberNodeDOM>) => {
    if (isDefined(parentDOM)) {
      DOM.remove();
    }
  };

  const commitReplacement = (parentDOM: FiberNodeDOM, DOM: NonNullable<FiberNodeDOM>) => {
    if (isDefined(parentDOM) && isInstanceOf(Element, parentDOM)) {
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

  for (const deletion of deletions) {
    if (deletion.dom) {
      const parentFiber = findParentFiber(deletion);
      commitDeletion(parentFiber?.dom, deletion.dom);
    }
  }

  if (wipRoot !== null) {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
  }

  wipRoot = null;
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
      deletions.push(oldFiberNode);
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
      wipFiber = fiberNode;
      wipFiber.hooks = [];
      hookIndex = 0;
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

function useState<S>(initialState: S | (() => S)): [S, Updater<UpdateStateAction<S>>];
function useState<S = undefined>(): [S | undefined, Updater<UpdateStateAction<S | undefined>>];
function useState<S>(initialState?: S | (() => S)): [S, Updater<UpdateStateAction<S>>] {
  const fiberNode: FiberNode<S> = wipFiber;
  const hook: {
    state: S;
    queue: S[];
  } = fiberNode?.alternate?.hooks
    ? fiberNode.alternate.hooks[hookIndex]
    : ({
        state: initialState,
        queue: [],
      } as { state: S; queue: S[] });

  while (hook.queue.length) {
    let newState = hook.queue.shift();
    if (isPlainObject(hook.state) && isPlainObject(newState)) {
      newState = { ...hook.state, ...newState };
    }
    if (isDefined(newState)) {
      hook.state = newState;
    }
  }

  if (typeof fiberNode.hooks === 'undefined') {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  hookIndex += 1;

  const setState = <SS extends S>(updater: UpdateStateAction<SS>): void => {
    const newValue = (isSomeFunction(updater) ? updater(hook.state) : updater) as S;

    hook.queue.push(newValue);
    if (currentRoot) {
      wipRoot = {
        type: currentRoot.type,
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      };
      nextUnitOfWork = wipRoot;
      deletions = [];
      currentRoot = null;
    }
  };

  return [hook.state, setState];
}

// Use requestIdleCallback to query whether there is currently a unit task
// and determine whether the DOM needs to be updated.
const workLoop: IdleRequestCallback = (deadline) => {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
};

// Start the engine!
void (function main(): void {
  window.requestIdleCallback(workLoop);
})();

export default {
  createElement: createVirtualElement,
  render,
  useState,
  Component,
  Fragment,
};
