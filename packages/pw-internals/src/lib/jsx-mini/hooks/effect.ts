import type { DependencyList, EffectCallback, EffectHook, FiberNode } from '../types';
import { isNil, isSomeFunction } from '@powwow-js/core';
import { isSameDeps } from './utils';

import { $$reely } from '../renderContext';

const getOrInit = (): EffectHook => {
  const fiberNode: FiberNode = $$reely.wipFiber;
  const hookIndex = $$reely.hookIndex;
  return (
    fiberNode?.alternate?.hooks
      ? fiberNode.alternate.hooks[hookIndex]
      : {
          type: 'effect',
          deps: [],
          cleanup: undefined,
        }
  ) as EffectHook;
};

export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
export function useEffect(effect: EffectCallback, deps: DependencyList): void;
export function useEffect(effect: EffectCallback, deps?: DependencyList): void {
  const fiberNode: FiberNode = $$reely.wipFiber;

  const hook: EffectHook = getOrInit();

  if (fiberNode?.alternate?.hooks) {
    if (!deps || !isSameDeps(deps, hook.deps)) {
      if (isSomeFunction(hook.cleanup)) {
        hook.cleanup();
      }
      hook.deps = deps;
      hook.cleanup = effect();
    }
  } else {
    hook.deps = deps;
    hook.cleanup = effect();
  }

  if (isNil(fiberNode.hooks)) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;
}
