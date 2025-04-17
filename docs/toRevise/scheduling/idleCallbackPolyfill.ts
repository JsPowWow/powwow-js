const supportsRequestIdleCallback = typeof requestIdleCallback === 'function';

/**
 * A minimal shim of the native IdleDeadline class.
 */
class IdleDeadline {
  initTime: DOMHighResTimeStamp;

  constructor(initTime: DOMHighResTimeStamp) {
    this.initTime = initTime;
  }

  get didTimeout() {
    return false;
  }

  timeRemaining() {
    return Math.max(0, 50 - (performance.now() - this.initTime));
  }
}

/**
 * A minimal shim for the requestIdleCallback function. This accepts a
 * callback function and runs it at the next idle period, passing in an
 * object with a `timeRemaining()` method.
 */
const requestIdleCallbackShim = (callback: (deadline: IdleDeadline) => void): number => {
  const deadline = new IdleDeadline(performance.now());
  return setTimeout(() => callback(deadline), 0) as unknown as number;
};

/**
 * A minimal shim for the  cancelIdleCallback function. This accepts a
 * handle identifying the idle callback to cancel.
 */
const cancelIdleCallbackShim = (handle: number) => {
  clearTimeout(handle);
};

/**
 * The native `requestIdleCallback()` function or `cancelIdleCallbackShim()`
 *.if the browser doesn't support it.
 */
export const rIC = supportsRequestIdleCallback ? requestIdleCallback : requestIdleCallbackShim;

/**
 * The native `cancelIdleCallback()` function or `cancelIdleCallbackShim()`
 * if the browser doesn't support it.
 */
export const cIC = supportsRequestIdleCallback ? cancelIdleCallback : cancelIdleCallbackShim;
