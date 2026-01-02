import { ChatUser } from '../../models/user';

import styles from './chat.module.css';

interface UserRendererProps {
  user: ChatUser;
}

export const UserRenderer = ({ user }: UserRendererProps) => {
  return (
    <div class={styles.userRenderer}>
      <div class={styles.userDisplayName}>{user.login}</div>
      {user.messages.length > 0 ? <div class={styles.userMessagesCount}>{user.messages.length}</div> : ''}
    </div>
  );
};
