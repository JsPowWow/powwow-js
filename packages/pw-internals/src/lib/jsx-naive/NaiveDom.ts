// @ts-nocheck

import createElementNaive from './jsxPragma';
import type { AnyFunction } from '@powwow-js/core';
import { isSomeFunction } from '@powwow-js/core';

export type StateUpdater<S> = (value: S) => void;
export type UpdateStateAction<S> = S | ((previousState: S) => S);

type NaiveDom = {
  <F extends AnyFunction>(componentFunction: F): (...parameters: Parameters<F>) => ReturnType<F>;
  now?: { args: unknown[]; slot: number; data: unknown[]; fn: AnyFunction };
};

const NaiveDom = (() => {
  let hooks: unknown[] = [];
  let idx: number = 0;
  let now: unknown[] = [];
  function $resets() {
    idx = 0;
  }
  // function workLoop() {
  //   idx = 0;
  //   //render(hooks)();
  //   setTimeout(workLoop, 300);
  // }
  // setTimeout(workLoop, 300);
  function renderHooked(componentFunction) {
    const saved = {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      fn: (...parameters: unknown[]) => {
        now.push(Object.assign(saved, { args: parameters, slot: 0 }));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const returnValue = componentFunction(...parameters);

        now.pop();
        //idx = 0;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return returnValue;
      },
      data: [],
    };
    return saved.fn;
  }

  function useState<S>(initialState: S | (() => S)): [S, StateUpdater<UpdateStateAction<S>>];
  function useState<S = undefined>(): [S | undefined, StateUpdater<UpdateStateAction<S | undefined>>];
  function useState(initVal?: unknown): unknown {
    const saved = now[now.length - 1];

    let state;
    if (!hooks[idx]) {
      state = initVal;
      hooks[idx] = initVal;
    } else {
      state = hooks[idx];
    }

    //const state = hooks[idx] || initVal;
    const _idx = idx;
    //console.log(`SS:render ${initVal}, idx:${_idx}`, hooks);

    const setState = (newVal): void => {
      //hooks[_idx] = newVal;
      hooks[_idx] = isSomeFunction(newVal) ? newVal(hooks[_idx]) : newVal;
      console.log(`SS:setState new: ${hooks[_idx]}, idx:${_idx}`, hooks);

      // TODO AR Warning ?
      saved.fn(...saved.args);
    };

    idx++;
    console.log(`SS:render ${state}, init(${initVal}), idx:${_idx}`, hooks);
    return [state, setState];
  }

  function useRef(val) {
    return useState({ current: val })[0];
  }

  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true;
    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    if (hasChanged) cb();
    hooks[idx] = depArray;
  }

  return {
    useState,
    $resets,
    //render: render(hooks),
    useEffect,
    useRef,
    renderHooked,
    createElement: createElementNaive,
  };
})();

export default NaiveDom;
