import Reely from '@powwow-js/reely';
import { useRerender } from '@powwow-js/reely-hook';
import { Chat } from '../actors';
import { ObjectStore } from '@powwow-js/simple-store';
import { UsersStore } from '../actors/chat/ChatActor';
import { RemoteUser } from '../../models/user';

type UseChatStore = {
  (): ObjectStore<UsersStore>;
  getOnlineUsers: (store: UsersStore) => RemoteUser[];
  getOfflineUsers: (store: UsersStore) => RemoteUser[];
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

useChatStore.getOnlineUsers = (store) => [...store.users.values()].filter((user) => user.isLogined);
useChatStore.getOfflineUsers = (store) => [...store.users.values()].filter((user) => !user.isLogined);
