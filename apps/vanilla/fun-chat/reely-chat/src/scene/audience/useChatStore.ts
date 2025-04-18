import Reely from '@powwow-js/reely';
import { useRerender } from '@powwow-js/reely-hook';
import { Chat } from '../actors';
import { ObjectStore } from '@powwow-js/simple-store';
import { UsersStore } from '../actors/chat/ChatActor';
import { ExtendedUser } from '../../models/user.model';

type UseChatStore = {
  (): ObjectStore<UsersStore>;
  getOnlineUsers: (store: UsersStore) => ExtendedUser[];
  getOfflineUsers: (store: UsersStore) => ExtendedUser[];
};

export const useChatStore: UseChatStore = () => {
  const [rerender] = useRerender();

  Reely.useEffect(() => {
    Chat.context.get().store.on('changed', rerender);
    return () => {
      Chat.context.get().store.off('changed', rerender);
    };
  }, []);
  return Chat.context.get().store;
};

useChatStore.getOnlineUsers = (store) => store.users.filter((user) => user.isLogined);
useChatStore.getOfflineUsers = (store) => store.users.filter((user) => !user.isLogined);
