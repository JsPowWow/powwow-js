import noop from '../fp/noop';
import type { PromiseReject, PromiseResolve } from '../types/function.types';

export type PromiseResolver<R, E extends Error = Error> = {
  promise: Promise<R>;
  resolve: PromiseResolve<R>;
  reject: PromiseReject<E>;
};

/**
 * @description Promise based helper with exposed `promise` and it `resolve`, `reject` methods
 */
export default function promiseResolver<R, E extends Error = Error>(): PromiseResolver<R, E> {
  let promiseResolve: PromiseResolve<R> = noop;
  let promiseReject: PromiseReject<E> = noop;

  const promise = new Promise<R>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });
  return {
    promise,
    resolve: promiseResolve,
    reject: promiseReject,
  };
}
