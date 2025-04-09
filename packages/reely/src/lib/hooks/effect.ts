import type { DependencyList, EffectCallback, EffectHook, FiberNode } from '../types';
import { isNil, isSomeFunction } from '@powwow-js/core';
import { isSameDeps } from './utils';

import { $$reely } from '../executionContext';

const getOrInit = (): EffectHook => {
  const fiberNode: FiberNode = $$reely.wipFiber;
  const hookIndex = $$reely.hookIndex;
  return (
    fiberNode?.alternate?.hooks
      ? fiberNode.alternate.hooks[hookIndex]
      : {
          type: 'effect',
          deps: [],
          cleanupEffect: undefined,
        }
  ) as EffectHook;
};

const update = (hook: EffectHook, effect: EffectCallback, deps: DependencyList | undefined): void => {
  hook.deps = deps;
  hook.effect = effect;
  effectHooks.push(hook);
  channel.port1.postMessage(null);
};

const channel = new MessageChannel();
const effectHooks: EffectHook[] = [];

channel.port2.onmessage = (): void => {
  while (effectHooks.length > 0) {
    const hook = effectHooks.shift();
    if (hook) {
      hook.cleanupEffect = hook.effect();
    }
  }
};

export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
export function useEffect(effect: EffectCallback, deps: DependencyList): void;
export function useEffect(effect: EffectCallback, deps?: DependencyList): void {
  const fiberNode: FiberNode = $$reely.wipFiber;

  const hook: EffectHook = getOrInit();

  if (fiberNode?.alternate?.hooks) {
    if (!deps || !isSameDeps(deps, hook.deps)) {
      if (isSomeFunction(hook.cleanupEffect)) {
        hook.cleanupEffect();
      }
      update(hook, effect, deps);
    }
  } else {
    update(hook, effect, deps);
  }

  if (isNil(fiberNode.hooks)) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;
}
