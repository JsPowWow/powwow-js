import { useInterval } from '@powwow-js/reely-hook';
import { useSocketConnection } from './useSocketConnection';
import { socketConnectionLogger } from '../actors';
import { useRouter } from '../../shared/routing/useRouter';

export const useReconnectOnError = (repeatInterval: number) => {
  const { state, connect } = useSocketConnection();
  const { pathName } = useRouter();

  const shouldAttemptReconnect = pathName === '/chat' && (state === 'failed' || state === 'offline');

  const interval = shouldAttemptReconnect ? repeatInterval : null;

  useInterval(() => {
    socketConnectionLogger.log('useReconnectOnError')('Attempt to reconnect..');
    connect();
  }, interval);
};
