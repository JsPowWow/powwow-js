import Reely from '@powwow-js/reely';
import { useRerender } from '@powwow-js/reely-hook';
import { Chat } from '../actors';

export const useChat = () => {
  const [rerender] = useRerender();

  Reely.useEffect(() => {
    Chat.on('stateChanged', rerender);
    return () => {
      Chat.off('stateChanged', rerender);
    };
  }, []);

  return Chat;
};
