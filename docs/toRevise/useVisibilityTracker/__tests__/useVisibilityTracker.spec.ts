import { fireEvent, renderHook } from '@testing-library/react';

import { setDevice } from '../../../device';
import { Device } from '../../../device/types';
import { useVisibilityTracker } from '../useVisibilityTracker';

describe('useVisibilityTracker', () => {
  it('should return the correct values for mobile', async () => {
    setDevice(Device.MOBILE);
    jest.spyOn(document.body, 'scrollHeight', 'get').mockImplementation(() => 1386);

    window.innerHeight = 667;

    const { result } = renderHook(() =>
      useVisibilityTracker({
        scrollableContainer: window,
        contentElementRef: {
          current: {
            scrollHeight: 1290,
            offsetTop: 48,
          },
        },
      })
    );

    fireEvent.scroll(window, { target: { scrollY: 720 } });

    expect(result.current.getScrollDepth()).toBe(100);
    expect(result.current.getVisibilityPercentage()).toBe(100);
    expect(result.current.getMaxScrollDepth()).toBe(100);
    expect(result.current.getMaxVisibilityPercentage()).toBe(100);

    fireEvent.scroll(window, { target: { scrollY: 150 } });

    expect(result.current.getScrollDepth()).toBe(21);
    expect(result.current.getVisibilityPercentage()).toBe(56);
    expect(result.current.getMaxScrollDepth()).toBe(100);
    expect(result.current.getMaxVisibilityPercentage()).toBe(100);
  });

  it('should return the correct values for desktop', async () => {
    setDevice(Device.DESKTOP);

    const scrollableContainer = document.createElement('div');

    jest.spyOn(scrollableContainer, 'clientHeight', 'get').mockImplementation(() => 764);

    const { result } = renderHook(() =>
      useVisibilityTracker({
        scrollableContainer,
        contentElementRef: {
          current: {
            scrollHeight: 1257,
            offsetTop: 102,
          },
        },
      })
    );

    fireEvent.scroll(scrollableContainer, { target: { scrollTop: 800 } });

    expect(result.current.getScrollDepth()).toBe(100);
    expect(result.current.getVisibilityPercentage()).toBe(100);
    expect(result.current.getMaxScrollDepth()).toBe(100);
    expect(result.current.getMaxVisibilityPercentage()).toBe(100);

    fireEvent.scroll(scrollableContainer, { target: { scrollTop: 200 } });

    expect(result.current.getScrollDepth()).toBe(29);
    expect(result.current.getVisibilityPercentage()).toBe(61);
    expect(result.current.getMaxScrollDepth()).toBe(100);
    expect(result.current.getMaxVisibilityPercentage()).toBe(100);
  });
});
