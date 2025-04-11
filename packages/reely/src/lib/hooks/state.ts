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
    if (Array.isArray(hook.state) && Array.isArray(newState)) {
      newState = (newState.length > 0 ? [...hook.state, ...newState] : newState) as S;
    }
    hook.state = newState as S;
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;

  const setState = <State extends S>(updater: UpdateStateAction<State>): void => {
    const newValue = transformState<S>(updater, hook.queue.at(-1));

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

function transformState<S>(state: unknown, prevState: unknown): S {
  if (isSomeFunction(state)) {
    return state(prevState) as S;
  }
  return state as S;
}
