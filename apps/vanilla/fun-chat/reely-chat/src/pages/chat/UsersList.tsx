import { GroupBox } from '../../shared/components/GroupBox';
import { useChatUsers } from '../../scene/audience/useChatUsers';
import { Spinner } from '../../shared/components/Spinner';
import { UserRenderer } from './UserRenderer';

export const UsersList = () => {
  const { online, offline } = useChatUsers();

  const hasUsers = online.length > 0 || offline.length > 0;

  return (
    <GroupBox
      caption='Users'
      //class='has-scrollbar'
      styles={{
        display: 'flex',
        // overflowY: 'auto',
        flexDirection: 'column',
        flexGrow: '1',
        gap: '4px',
        width: '20%',
        // maxHeight: 'calc(-230px + 100vh)',
      }}
    >
      {!hasUsers && <Spinner show />}
      <ul class='tree-view has-container has-scrollbar' styles={{ overflowY: 'auto', height: 'calc(-260px + 100vh)' }}>
        <details open>
          <summary>🟢 Online {`(${online.length})`}</summary>
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
