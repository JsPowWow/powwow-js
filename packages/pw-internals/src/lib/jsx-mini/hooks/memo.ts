import type { DependencyList, FiberNode, MemoHook } from '../types';
import { $$reely } from '../executionContext';
import { hasProperty, isNil } from '@powwow-js/core';
import { isSameDeps } from './utils';

function assertIsMemoHook<T>(hook: unknown): asserts hook is MemoHook<T> {
  if (!hook || (hasProperty('type', hook) && hook['type'] !== 'memo')) {
    throw new Error(`Expect to have "MemoHook", but got ${JSON.stringify(hook)}`);
  }
}

const getOrCreate = <T>(): [boolean, MemoHook<T>] => {
  const fiberNode: FiberNode = $$reely.wipFiber;
  const hookIndex = $$reely.hookIndex;
  if (fiberNode?.alternate?.hooks) {
    const currentHook = fiberNode?.alternate?.hooks[hookIndex];
    assertIsMemoHook<T>(currentHook);
    return [true, currentHook];
  }
  const newHook: MemoHook<T> = {
    type: 'memo',
    deps: [],
    value: undefined as T,
  };
  return [false, newHook];
};

export function useMemo<T>(factory: () => T, deps: DependencyList): T {
  const [isExisted, hook] = getOrCreate<T>();
  const fiberNode: FiberNode = $$reely.wipFiber;
  if (isExisted && (!deps || !isSameDeps(deps, hook.deps))) {
    hook.value = factory();
    hook.deps = deps;
  } else if (!isExisted) {
    hook.value = factory();
    hook.deps = deps;
  }

  if (isNil(fiberNode.hooks)) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;

  return hook.value;
}
