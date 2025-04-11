import Reely, { useCallback } from '@powwow-js/reely';
import { socketConnection } from './socketConnection';
import { useRerender } from '@powwow-js/reely-hook';

export const useSocketConnection = () => {
  const [rerender] = useRerender();
  Reely.useEffect(() => {
    // NOTE: or
    socketConnection.on('stateChanged', rerender);
    return () => {
      socketConnection.off('stateChanged', rerender);
    };
  }, []);

  const connect = useCallback(() => {
    socketConnection.send('connect');
  }, []);

  const disconnect = useCallback(() => {
    socketConnection.send('disconnect');
  }, []);

  return {
    state: socketConnection.state,
    connect,
    disconnect,
  };
};
