import { LoginForm, LoginFormProps } from './LoginForm';
import { useCallback } from '@powwow-js/reely';

export const LoginPage = () => {
  const handleLoginFormSubmit = useCallback<LoginFormProps['onSubmit']>((data) => {
    console.log('LoginPage::handleLoginFormSubmit', data);
  }, []);
  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
