import { useInterval } from '@powwow-js/reely-hook';
import { useSocketConnection } from './useSocketConnection';
import { socketConnectionLogger } from '../actors';

export const useReconnectOnError = (repeatInterval: number) => {
  const { state, connect } = useSocketConnection();
  // const { pathName } = useRouter();

  const shouldAttemptReconnect = state === 'failed' || state === 'offline'; //pathName === '/chat' &&

  const interval = shouldAttemptReconnect ? repeatInterval : null;

  useInterval(() => {
    socketConnectionLogger.log('useReconnectOnError')('Attempt to reconnect..');
    connect();
  }, interval);
};
