import { useInterval } from '@powwow-js/reely-hook';
import { useSocketConnection } from './useSocketConnection';
import { socketConnectionLogger } from '../actors';

export const useReconnectOnError = (repeatInterval: number) => {
  const connection = useSocketConnection();
  // const { pathName } = useRouter();

  const shouldAttemptReconnect = connection.state === 'failed' || connection.state === 'offline'; //pathName === '/chat' &&

  const interval = shouldAttemptReconnect ? repeatInterval : null;

  useInterval(() => {
    if (connection.state === 'failed' || connection.state === 'offline') {
      socketConnectionLogger.log('🔄 useReconnectOnError')('attempt to reconnect..');
      connection.connect();
    }
  }, interval);
};
