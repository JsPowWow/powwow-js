import { GroupBox } from '../../shared/components/GroupBox';
import { Spinner } from '../../shared/components/Spinner';
import { UserRenderer } from './UserRenderer';
import styles from './chat.module.css';
import { cn } from '@powwow-js/fun-dom';
import { useChatStoreUsers } from '../../scene/audience/useChatStoreUsers';
import { useDebounce } from '@powwow-js/reely-hook';
import { hasProperty, isString } from '@powwow-js/core';
import { useState } from '@powwow-js/reely';
import { ChatUser, RemoteUser } from '../../models/user';

const byUserLogin = (filterString: string) => (user: RemoteUser) =>
  user.login.toLocaleLowerCase().includes(filterString.toLocaleLowerCase());

const sortUsers = (a: ChatUser, b: ChatUser) => {
  const aHasMessages = a.messages.length > 0;
  const bHasMessages = b.messages.length > 0;

  if (aHasMessages && !bHasMessages) {
    return -1;
  }
  if (!aHasMessages && bHasMessages) {
    return 1;
  }

  return a.login.localeCompare(b.login);
};

export const UsersList = () => {
  const { hasUsers, online, offline } = useChatStoreUsers();
  const [filterString, setFilterString] = useState('');

  const debounced = useDebounce((event: InputEvent): void => {
    if (hasProperty('value', event.target) && isString(event.target.value)) {
      setFilterString(event.target.value);
    }
  }, 400); // TODO AR from settings

  return (
    <GroupBox className={styles.usersListContainer} styles={{ margin: '0', padding: '4px 6px' }} caption='Users'>
      <input
        id='isername-filter-unput'
        type='text'
        name='isername-filter-unput'
        placeholder='Type username to filter'
        styles={{ width: '100%' }}
        onInput={debounced}
      />
      <ul className={cn(styles.usersList, 'tree-view', 'has-container', 'has-scrollbar')}>
        <details open>
          <summary style='display: flex; gap: 4px; white-space: nowrap'>
            🟢 Online {`(${online.length})`}
            {!hasUsers && <Spinner show />}
          </summary>

          <ul styles={{ paddingLeft: '0', marginLeft: '-10px' }}>
            {online
              .filter(byUserLogin(filterString))
              .sort(sortUsers)
              .map((item) => (
                <li styles={{ marginTop: '1px' }}>
                  <UserRenderer user={item} />
                </li>
              ))}
          </ul>
        </details>
        <details open>
          <summary>⚪️ Offline {`(${offline.length})`}</summary>
          <ul styles={{ paddingLeft: '0', marginLeft: '-10px' }}>
            {offline
              .filter(byUserLogin(filterString))
              .sort(sortUsers)
              .map((item) => (
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
