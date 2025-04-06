import { useMemo } from './memo';
import type { AnyFunction } from '@powwow-js/core';
import type { DependencyList } from '../types';

export function useCallback<T extends AnyFunction>(callback: T, deps: DependencyList): T;
export function useCallback<T extends AnyFunction>(cb: T, deps: DependencyList): T {
  return useMemo(() => cb, deps);
}
