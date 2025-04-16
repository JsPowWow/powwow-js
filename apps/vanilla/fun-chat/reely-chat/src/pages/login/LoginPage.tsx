import { LoginForm, LoginFormProps } from './LoginForm';
import { useCallback, useEffect } from '@powwow-js/reely';
import { useChat } from '../../scene/audience/useChat';
import { useRouter } from '../../shared/routing/useRouter';

export const LoginPage = () => {
  const chat = useChat();

  const { navigate } = useRouter();

  useEffect(() => {
    if (chat.state === 'authorized') {
      navigate('/chat');
    }
  }, []);

  const handleLoginFormSubmit = useCallback<LoginFormProps['onSubmit']>(async (data) => {
    const result = await chat.send('login', data);
    return result.success ? { success: true, value: '' } : { success: false, errorMessage: result.message };
  }, []);
  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
