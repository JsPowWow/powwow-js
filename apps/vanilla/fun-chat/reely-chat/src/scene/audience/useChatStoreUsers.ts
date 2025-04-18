import { useMemo } from '@powwow-js/reely';
import { useChatStore } from './useChatStore';

export const useChatStoreUsers = () => {
  const store = useChatStore();

  return useMemo(() => {
    const online = store.select(useChatStore.getOnlineUsers);
    const offline = store.select(useChatStore.getOfflineUsers);
    const hasUsers = online.length > 0 || offline.length > 0;

    return {
      online,
      offline,
      hasUsers,
    };
  }, [store.get()]);
};
