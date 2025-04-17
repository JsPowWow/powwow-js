import { act, renderHook } from '@testing-library/react';

import { useVisibility } from '../index';

describe('useVisibility Specs', () => {
  it('useVisibility hook initializes with the provided initial visibility', () => {
    const { result } = renderHook(() => useVisibility(true));
    const [isVisible] = result.current;

    expect(isVisible).toBe(true);
  });

  it('show function sets isVisible to true', () => {
    const { result } = renderHook(() => useVisibility(false));
    const [, show] = result.current;

    act(() => {
      show();
    });

    const [isVisible] = result.current;
    expect(isVisible).toBe(true);
  });

  it('hide function sets isVisible to false', () => {
    const { result } = renderHook(() => useVisibility(true));
    const [, , hide] = result.current;

    act(() => {
      hide();
    });

    const [isVisible] = result.current;
    expect(isVisible).toBe(false);
  });
});
