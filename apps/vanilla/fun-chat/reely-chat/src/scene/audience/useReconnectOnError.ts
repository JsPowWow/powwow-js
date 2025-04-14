import { useInterval } from '@powwow-js/reely-hook';
import { useSocketConnection } from './useSocketConnection';
import { socketConnectionLogger } from '../actors';

export const useReconnectOnError = (repeatInterval: number) => {
  const { state, connect } = useSocketConnection();

  const interval = state === 'failed' || state === 'offline' ? repeatInterval : null;
  useInterval(() => {
    socketConnectionLogger.log('Attempt to reconnect..');
    connect();
  }, interval);
};
