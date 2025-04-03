import type { FiberNode, StateHook, Updater, UpdateStateAction } from '../types';
import { hasSome, isPlainObject, isSomeFunction } from '@powwow-js/core';

import { $$reely } from '../renderContext';

export function useState<S>(initialState: S | (() => S)): [S, Updater<UpdateStateAction<S>>];
export function useState<S = undefined>(): [S | undefined, Updater<UpdateStateAction<S | undefined>>];
export function useState<S>(initialState?: S | (() => S)): [S, Updater<UpdateStateAction<S>>] {
  const fiberNode: FiberNode<S> = $$reely.wipFiber as FiberNode<S>;
  const hook: StateHook<S> = (
    fiberNode?.alternate?.hooks
      ? fiberNode.alternate.hooks[$$reely.hookIndex]
      : {
          state: initialState,
          queue: [],
        }
  ) as StateHook<S>;

  const isBatching = hook.queue.length > 0;
  while (hook.queue.length > 0) {
    let newState = hook.queue.shift();
    if (isBatching && isPlainObject(hook.state) && isPlainObject(newState)) {
      newState = { ...hook.state, ...newState };
    }
    // TODO AR remove it to a;;ow nullish state (?)
    if (hasSome(newState)) {
      hook.state = newState;
    }
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
