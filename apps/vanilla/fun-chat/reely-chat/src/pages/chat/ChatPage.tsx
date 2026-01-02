import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { WndView } from '../../shared/components/WndView';
import { UsersList } from './UsersList';
import { useChat } from '../../scene/audience/useChat';
import { Maybe } from '@powwow-js/core';

import styles from './chat.module.css';

import { cn } from '@powwow-js/fun-dom';
import { Messages } from './Messages';
import { MessagesForm } from './MessagesForm';

export const ChatPage = () => {
  const { context } = useChat();

  // const { navigate } = useRouter();
  //
  // useEffect(() => {
  //   if (state !== 'authorized') {
  //     navigate('/login');
  //   }
  // }, []);
  // TODO REVISE

  return (
    <WndView className={cn(styles.chatWindow, 'show glass')}>
      <WndTitleBar caption='🥳 Chat' />
      <WndBody
        className='has-space'
        styles={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
        // styles={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '5px' }}
      >
        <h2 class={cn(styles.currentUserDisplayName, 'instruction instruction-primary')}>
          {`${Maybe.from(context.get().currentUser?.login).getOrDefault('<none>')} 💬`}
        </h2>
        <div class={styles.chatAreaContainer}>
          <UsersList />
          <div class={styles.chatMessagesContainer}>
            <Messages />
            <MessagesForm />
          </div>
        </div>
      </WndBody>
    </WndView>
  );
};
