import { renderHook } from '@testing-library/react';
import axios from 'axios';

import { useRequest } from '../index';

const cancel = jest.fn();
const token = {
  promise: new Promise(jest.fn()),
  throwIfRequested: jest.fn(),
};
// @ts-ignore
jest.spyOn(axios.CancelToken, 'source').mockImplementation(() => ({
  token,
  cancel,
}));

describe('useRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const request = jest.fn().mockImplementation(() => Promise.resolve(1));

  it('should not call request', () => {
    renderHook(() => useRequest({ request, shouldCall: false }));

    expect(request).not.toHaveBeenCalled();
  });

  it('should call request with cancel token', () => {
    renderHook(() => useRequest({ request, shouldCall: true }));

    expect(request).toHaveBeenCalledWith({ cancelToken: token });
  });

  it('should cancel token on unmount', () => {
    const { unmount } = renderHook(() => useRequest({ request, shouldCall: true }));

    expect(cancel).not.toHaveBeenCalled();

    unmount();

    expect(cancel).toHaveBeenCalled();
  });
});
