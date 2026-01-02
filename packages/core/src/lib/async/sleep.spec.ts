import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a promise', () => {
    expect(sleep(100)).toBeInstanceOf(Promise);
  });

  it('should resolve after the specified delay', async () => {
    const delay = 1000;
    let resolved = false;

    const delayedPromise = sleep(delay).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(delay - 1);

    // Check it's not resolved yet
    await Promise.resolve();
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(1);

    // Now it should resolve
    await delayedPromise;
    expect(resolved).toBe(true);
  });

  it('should resolve with `undefined` when no data is provided', async () => {
    const delay = 100;
    const promise = sleep(delay);

    vi.advanceTimersByTime(delay);
    const result = await promise;

    expect(result).toBeUndefined();
  });

  it('should resolve with the provided data', async () => {
    const delay = 100;
    const data = { foo: 'bar' };
    const promise = sleep(delay, data);

    vi.advanceTimersByTime(delay);
    const result = await promise;

    expect(result).toStrictEqual({ foo: 'bar' });
  });

  it('should work with 0 delay', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    const result = await promise;
    expect(result).toBeUndefined();
  });
});
