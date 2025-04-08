import type { ContextHook, FiberNode, ValueContext } from '../types';
import { $$reely } from '../executionContext';
import type { Nullable } from '@powwow-js/core';
import { hasProperty, isNil } from '@powwow-js/core';

function assertIsContextHook<T>(hook: unknown): asserts hook is ContextHook<T> {
  if (!hook || (hasProperty('type', hook) && hook['type'] !== 'context')) {
    throw new Error(`Expect to have "ContextHook", but got ${JSON.stringify(hook)}`);
  }
}

const findContextFiber = (fiberNode: FiberNode, context: unknown): Nullable<FiberNode> => {
  let parentFiber = fiberNode.return;
  while (parentFiber && !(parentFiber.type === context)) {
    parentFiber = parentFiber.return;
  }
  return parentFiber;
};

const getOrCreate = <T>(context: ValueContext<T>): [boolean, ContextHook<T>] => {
  const fiberNode: FiberNode = $$reely.wipFiber;
  const hookIndex = $$reely.hookIndex;

  if (fiberNode?.alternate?.hooks) {
    const currentHook = fiberNode?.alternate?.hooks[hookIndex];
    assertIsContextHook<T>(currentHook);
    return [true, currentHook];
  }

  const newHook: ContextHook<T> = {
    type: 'context',
    value: context.defaultValue,
  };
  return [false, newHook];
};

export function useContext<T>(context: ValueContext<T>): T {
  const [_, hook] = getOrCreate<T>(context);
  const fiberNode: FiberNode = $$reely.wipFiber;

  const ctxElement = findContextFiber(fiberNode, context);
  // console.log('ctxElement', ctxElement);
  if (!ctxElement) {
    console.warn('Context.Provider not found', context);
  }

  const currentValue = hook.value;
  const newValue = ctxElement ? (ctxElement.props['value'] as T) : context.defaultValue;
  if (!Object.is(newValue, currentValue)) {
    hook.value = newValue;
    // console.log('contextValues', { currentValue, newValue });
  }

  if (isNil(fiberNode.hooks)) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  $$reely.hookIndex += 1;

  return hook.value;
}
