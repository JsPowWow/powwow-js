import Reely from '@powwow-js/reely';
import { useRerender } from '@powwow-js/reely-hook';
import { Chat } from '../actors';

export const useChatUsers = () => {
  const [rerender] = useRerender();

  Reely.useEffect(() => {
    Chat.context.get().users.on('changed', rerender);
    return () => {
      Chat.context.get().users.off('changed', rerender);
    };
  }, []);

  return Chat.context.get().users.get();
};
