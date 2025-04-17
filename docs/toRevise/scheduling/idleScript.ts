import { cIC, rIC } from './idleCallbackPolyfill';

interface IdleScript {
  initScript: () => void;
  cancelScript: () => void;
}

/**
 * Wraps a callback in a requestIdleCallback to execute when the browser is idle. Also:
 * 1. Uses a polyfill if the native function is not available.
 * 2. Can guarantee that the task will be executed immediately when called.
 */
const createIdleScript = (callback: () => void): IdleScript => {
  let idleHandle: number | null = null;
  let isInitialized = false;

  const wrappedCallback = () => {
    callback();
    isInitialized = true;
  };

  idleHandle = rIC(wrappedCallback);

  /**
   * If callback has not been called, it will cancel any scheduled requestIdleCallback and be called immediately.
   */
  const initScript = (): void => {
    if (!isInitialized) {
      cancelScript();
      wrappedCallback();
    }
  };

  /**
   * Cancels any scheduled requestIdleCallback and resets the handle.
   */
  const cancelScript = (): void => {
    if (idleHandle !== null) {
      cIC(idleHandle);
      idleHandle = null;
    }
  };

  return {
    initScript,
    cancelScript,
  };
};

export { createIdleScript };
