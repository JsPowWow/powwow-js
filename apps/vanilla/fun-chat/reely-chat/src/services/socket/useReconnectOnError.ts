import { useInterval } from '@powwow-js/reely-hook';
import { useSocketConnection } from './useSocketConnection';

export const useReconnectOnError = (repeatInterval: number) => {
  const { state, connect } = useSocketConnection();

  const interval = state === 'failed' || state === 'offline' ? repeatInterval : null;

  useInterval(() => {
    console.log('Attempt to reconnect..');
    connect();
  }, interval);
};
