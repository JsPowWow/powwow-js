import styles from './chat.module.css';
import { GroupBox } from '../../shared/components/GroupBox';

export const MessagesForm = () => {
  return (
    <GroupBox className={styles.messagesFormBox} styles={{ margin: '0', padding: '4px 6px' }} caption='Input message'>
      <article role='tabpanel' className={styles.messagesFormWrapper}>
        <form className={styles.messagesForm}></form>
      </article>
    </GroupBox>
  );
};
