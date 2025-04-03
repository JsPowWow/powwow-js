import { FiberNode } from '@pw-internals/jsx-runtime';
import { hasSome, Nullable } from '@powwow-js/core';

export const findChildFiber = (fiberNode?: FiberNode): Nullable<FiberNode> => {
  if (fiberNode) {
    let childFiber = fiberNode.child;
    while (childFiber && !childFiber.dom) {
      childFiber = childFiber.child;
    }
    return childFiber;
  }

  return null;
};

export const findParentFiber = (fiberNode?: FiberNode): Nullable<FiberNode> => {
  if (fiberNode) {
    let parentFiber = fiberNode.return;
    while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.return;
    }
    return parentFiber;
  }

  return null;
};

export const runCleanupEffects = (fiberNode: FiberNode) => {
  fiberNode.hooks?.forEach((hook) => {
    if (hook.type === 'effect' && hasSome(hook.cleanupEffect)) {
      hook.cleanupEffect();
    }
  });
};
