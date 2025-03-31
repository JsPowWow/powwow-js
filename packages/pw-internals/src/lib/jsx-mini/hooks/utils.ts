import type { DependencyList } from '../types';
import type { Nullable } from 'vitest';

export function isSameDeps(deps: DependencyList, hookDeps: Nullable<DependencyList>): boolean {
  if (!deps && !hookDeps) {
    return true;
  }

  if ((!deps && hookDeps) || (deps && !hookDeps)) return false;

  if (deps && hookDeps) {
    if (deps.length !== hookDeps.length) {
      return false;
    }

    for (let i = 0; i < deps.length; ++i) {
      if (!Object.is(deps[i], hookDeps[i])) {
        return false;
      }
    }
  }

  return true;
}
