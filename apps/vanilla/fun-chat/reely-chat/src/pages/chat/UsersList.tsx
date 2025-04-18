import { GroupBox } from '../../shared/components/GroupBox';
import { useChatStore } from '../../scene/audience/useChatStore';
import { Spinner } from '../../shared/components/Spinner';
import { UserRenderer } from './UserRenderer';
import { useMemo } from '@powwow-js/reely';
import styles from './chat.module.css';
import { cn } from '@powwow-js/fun-dom';

export const UsersList = () => {
  const store = useChatStore();

  const { online, offline } = useMemo(() => {
    return {
      online: store.select(useChatStore.getOnlineUsers),
      offline: store.select(useChatStore.getOfflineUsers),
    };
  }, [store.get().users]);

  const hasUsers = online.length > 0 || offline.length > 0;

  return (
    <GroupBox className={styles.usersListContainer} caption='Users'>
      <ul className={cn(styles.usersList, 'tree-view', 'has-container', 'has-scrollbar')}>
        <details open>
          <summary style='display: flex; gap: 4px'>
            🟢 Online {`(${online.length})`}
            {!hasUsers && <Spinner show />}
          </summary>

          <ul styles={{ paddingLeft: '0' }}>
            {online.map((item) => (
              <li styles={{ marginTop: '1px' }}>
                <UserRenderer user={item} />
              </li>
            ))}
          </ul>
        </details>
        <details open>
          <summary>⚪️ Offline {`(${offline.length})`}</summary>
          <ul styles={{ paddingLeft: '0' }}>
            {offline.map((item) => (
              <li styles={{ marginTop: '1px' }}>
                <UserRenderer user={item} />
              </li>
            ))}
          </ul>
        </details>
      </ul>
    </GroupBox>
  );
};
