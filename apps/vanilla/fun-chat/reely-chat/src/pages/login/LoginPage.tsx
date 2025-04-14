import { LoginForm, LoginFormProps } from './LoginForm';
import { useCallback } from '@powwow-js/reely';
import { useChat } from '../../scene/audience/useChat';
import { performLogin } from '../../scene/actors/chat/chatApiActions';
import { useRouter } from '../../shared/routing/useRouter';

export const LoginPage = () => {
  const chat = useChat();
  const { navigate } = useRouter();

  const handleLoginFormSubmit = useCallback<LoginFormProps['onSubmit']>((data) => {
    return performLogin(chat, data).then(({ unwrap }) => {
      return unwrap(
        (error) => ({ success: false, errorMessage: error.message }),
        (_user) => {
          navigate('/chat');
          return { success: true, value: '' };
        }
      );
    });
  }, []);
  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
