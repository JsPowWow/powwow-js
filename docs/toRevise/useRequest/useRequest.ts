import axios from 'axios';
import { useCallback, useEffect, useRef } from 'react';

import { usePolling } from '../usePolling';
import { RequestType } from './types';
import { PollingConfigType } from '../usePolling/types';

export const useRequest = ({
  request,
  pollingConfig,
  shouldCall,
}: {
  request: RequestType;
  pollingConfig?: PollingConfigType;
  shouldCall?: boolean;
}) => {
  const sourceRef = useRef(axios.CancelToken.source());

  const callRequest = useCallback(async () => {
    if (shouldCall) {
      sourceRef.current = axios.CancelToken.source();

      await request({ cancelToken: sourceRef.current.token });
    }
  }, [request, shouldCall]);

  useEffect(() => {
    callRequest();

    return () => {
      sourceRef.current.cancel('Cancel request');
    };
  }, [callRequest]);

  usePolling({ pollingConfig, request: callRequest });
};
