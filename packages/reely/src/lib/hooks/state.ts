import type { FiberNode, StateHook, Updater, UpdateStateAction } from '../types';
import { isPlainObject, isSomeFunction } from '@powwow-js/core';

import { $$reely } from '../executionContext';

export function useState<S>(initialState: S | (() => S)): [S, Updater<UpdateStateAction<S>>];
export function useState<S = undefined>(): [S | undefined, Updater<UpdateStateAction<S | undefined>>];
export function useState<S>(initialState?: S | (() => S)): [S, Updater<UpdateStateAction<S>>] {
  const fiberNode: FiberNode = $$reely.wipFiber;
  const hook: StateHook<S> = (
    fiberNode?.alternate?.hooks
      ? fiberNode.alternate.hooks[$$reely.hookIndex]
      : {
          state: isSomeFunction(initialState) ? initialState() : initialState,
          queue: [],
        }
  ) as StateHook<S>;

  while (hook.queue.length > 0) {
    let newState = hook.queue.shift();

    if (isPlainObject(hook.state) && isPlainObject(newState)) {
      newState = { ...hook.state, ...newState };
    }
    hook.state = newState as S;
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;

  const setState = <SS extends S>(updater: UpdateStateAction<SS>): void => {
    const newValue = (isSomeFunction(updater) ? updater(hook.state) : updater) as S;

    hook.queue.push(newValue);
    if ($$reely.currentRoot) {
      $$reely.wipRoot = {
        type: $$reely.currentRoot.type,
        dom: $$reely.currentRoot.dom,
        props: $$reely.currentRoot.props,
        alternate: $$reely.currentRoot,
      };
      $$reely.nextUnitOfWork = $$reely.wipRoot;
      $$reely.deletions = [];
      $$reely.currentRoot = null;
    }
  };

  return [hook.state, setState];
}
