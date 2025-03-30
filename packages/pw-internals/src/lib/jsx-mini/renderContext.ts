import { Nullable } from 'vitest';
import { FiberNode } from '@pw-internals/jsx-runtime';

export const $$reely = new (class ReelyExecCtx {
  wipRoot: Nullable<FiberNode>;
  nextUnitOfWork: Nullable<FiberNode>;
  currentRoot: Nullable<FiberNode>;
  deletions: FiberNode[] = [];
  wipFiber: FiberNode = null as unknown as FiberNode;
  hookIndex: number = 0;
})();
