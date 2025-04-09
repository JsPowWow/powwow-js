import { Nullable } from '@powwow-js/core';
import { FiberNode } from './types';

// TODO AR rework, extract hook index
export const $$reely = new (class ReelyExecCtx {
  wipRoot: Nullable<FiberNode>;
  nextUnitOfWork: Nullable<FiberNode>;
  currentRoot: Nullable<FiberNode>;
  deletions: FiberNode[] = [];
  wipFiber: FiberNode = null as unknown as FiberNode;
  hookIndex: number = 0;
})();
