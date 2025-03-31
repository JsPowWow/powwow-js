import { FiberNode } from '@pw-internals/jsx-runtime';
import { Nullable } from '@powwow-js/core';

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
