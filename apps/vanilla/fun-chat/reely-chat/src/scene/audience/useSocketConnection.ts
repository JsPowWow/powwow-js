import Reely, { useCallback } from '@powwow-js/reely';
import { useRerender } from '@powwow-js/reely-hook';
import { SocketConnection } from '../actors';

export const useSocketConnection = () => {
  const [rerender] = useRerender();

  Reely.useEffect(() => {
    SocketConnection.on('stateChanged', rerender);
    return () => {
      SocketConnection.off('stateChanged', rerender);
    };
  }, []);

  const connect = useCallback(() => {
    SocketConnection.send('connect');
  }, []);

  const disconnect = useCallback(() => {
    SocketConnection.send('disconnect');
  }, []);

  return {
    state: SocketConnection.state,
    connect,
    disconnect,
  };
};
