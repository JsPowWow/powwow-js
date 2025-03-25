import type { AnyFunction } from '@powwow-js/core';
import { hasSome, isSomeFunction } from '@powwow-js/core';

export type Updater<S> = (value: S) => void;
export type UpdateStateAction<S> = S | ((previousState: S) => S);

type WithUsingState = {
  <F extends AnyFunction>(componentFunction: F): (...parameters: Parameters<F>) => ReturnType<F>;
  now?: { args: unknown[]; slot: number; data: unknown[]; fn: AnyFunction };
};

export const withUsingState: WithUsingState = (componentFunction) => {
  const saved = {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    fn: (...parameters: unknown[]) => {
      withUsingState.now = Object.assign(saved, { args: parameters, slot: 0 });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const returnValue = componentFunction(...parameters);

      delete withUsingState.now;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return returnValue;
    },
    data: [],
  };

  return saved.fn;
};

export function useState<S>(initialState: S | (() => S)): [S, Updater<UpdateStateAction<S>>];
export function useState<S = undefined>(): [S | undefined, Updater<UpdateStateAction<S | undefined>>];

export function useState(value?: unknown): unknown {
  const saved = withUsingState.now;
  const slot = saved?.slot;

  if (hasSome(saved) && hasSome(slot)) {
    saved.slot = saved.slot + 1;
    value = slot in saved.data ? saved.data[slot] : (saved.data[slot] = value); // TODO AR
  }

  return [
    value,
    (updater: Updater<UpdateStateAction<unknown>>): void => {
      if (hasSome(saved) && hasSome(slot)) {
        saved.data[slot] = isSomeFunction(updater) ? updater(saved.data[slot]) : updater;
        saved.fn(...saved.args);
      }
    },
  ];
}
