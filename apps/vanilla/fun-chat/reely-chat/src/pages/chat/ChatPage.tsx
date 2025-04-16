import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { WndView } from '../../shared/components/WndView';
import { UsersList } from './UsersList';
import { useChat } from '../../scene/audience/useChat';
import { Maybe } from '@powwow-js/core';
import { useRouter } from '../../shared/routing/useRouter';
import { useEffect } from '@powwow-js/reely';

export const ChatPage = () => {
  const { context, state } = useChat();

  const { navigate } = useRouter();

  useEffect(() => {
    if (state !== 'authorized') {
      navigate('/login');
    }
  }, []);

  return (
    <WndView className='show glass chat-window'>
      <WndTitleBar caption='🥳 Chat' />
      <WndBody
        className='has-space'
        styles={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '5px' }}
      >
        <h2 class='instruction instruction-primary' style='margin-bottom: 6px;'>
          {`${Maybe.from(context.get().currentUser?.login).getOrDefault('<none>')} 💬`}
        </h2>
        <UsersList />
      </WndBody>
    </WndView>
  );
};
