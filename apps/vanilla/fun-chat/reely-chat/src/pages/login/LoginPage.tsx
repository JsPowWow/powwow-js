import { LoginForm, LoginFormProps } from './LoginForm';
import { useCallback } from '@powwow-js/reely';

export const LoginPage = () => {
  // const { send } = useChat();

  const handleLoginFormSubmit = useCallback<LoginFormProps['onSubmit']>((data) => {
    console.log('LoginPage::handleLoginFormSubmit', data);
    // return fromPromise(Promise.resolve('Ok'));
    //return doLogin(data);
    return Promise.resolve({ success: false, errorMessage: 'AAAA BBB' });

    // return send('login', data).then((result) => {
    //   console.log('LoginPage::handleLoginFormSubmit Result', result);
    //   return result.success ? { success: true, value: '' } : { success: false, errorMessage: result.message };
    // });
  }, []);
  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
