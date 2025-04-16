import { WndView } from '../../shared/components/WndView';
import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { GroupBox } from '../../shared/components/GroupBox';
import { assertIsInstanceOf } from '@powwow-js/core';
import { useState } from '@powwow-js/reely';
import { validateUserNameFormData, validateUserPasswordFormData, ValidationResult } from './validation';
import { SocketConnectionStatus } from '../../widgets/SocketConnectionStatus';
import { useSocketConnection } from '../../scene/audience/useSocketConnection';
import { ChatStatus } from '../../widgets/ChatStatus';

const NO_ERRORS: FormValidationState = Object.freeze({
  username: { success: true, value: '' },
  password: { success: true, value: '' },
  submission: { success: true, value: '' },
});

type FormValidationState = {
  username: ValidationResult;
  password: ValidationResult;
  submission: ValidationResult;
};

export interface LoginFormProps {
  onSubmit: (formData: { username: string; password: string }) => Promise<ValidationResult>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [validation, setValidation] = useState<FormValidationState>(NO_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useSocketConnection();
  const isInputDisabled = state !== 'online' || isSubmitting;

  const clearErrors = () => setValidation(NO_ERRORS);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    assertIsInstanceOf(HTMLFormElement, event.target);

    const formData = new FormData(event.target);

    const username = formData.get('username');
    const userNameValidation = validateUserNameFormData(username);
    setValidation((current) => ({
      ...current,
      username: userNameValidation,
    }));

    const password = formData.get('password');
    const passwordValidation = validateUserPasswordFormData(password);
    setValidation((current) => ({
      ...current,
      password: passwordValidation,
    }));

    if (userNameValidation.success && passwordValidation.success) {
      setIsSubmitting(true);
      await onSubmit({ username: userNameValidation.value, password: passwordValidation.value })
        .then((result) => {
          if (!result.success) {
            setValidation((current) => ({
              ...current,
              submission: result,
            }));
          }
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} onReset={clearErrors}>
      <WndView
        id='login-dialog'
        className='show glass'
        role='dialog'
        aria-labelledby='login dialog-title'
        styles={{ width: '60%', minWidth: '215px', maxWidth: '355px' }}
      >
        <WndTitleBar caption='🔰 Login' maximize={false} minimize={false} />
        <WndBody className='has-space' styles={{ height: '100%' }}>
          {/*<h2 class='instruction instruction-primary' style='margin-bottom: 6px;'>*/}
          {/*  Please authorize on chat-server*/}
          {/*</h2>*/}
          <GroupBox caption='Authorization' styles={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div styles={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '5px' }}>
              <label for='login-username'>Name:</label>
              <input
                id='login-username'
                type='text'
                name='username'
                placeholder='Username'
                {...(isInputDisabled ? { disabled: isInputDisabled } : null)}
                styles={{ width: '100%' }}
                onInput={clearErrors}
              />
              <label class='form-error-label'>
                {validation.username.success ? '' : validation.username.errorMessage}
              </label>
            </div>
            <div styles={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '5px' }}>
              <label for='login-password'>Password:</label>
              <input
                id='login-password'
                type='password'
                autocomplete
                name='password'
                placeholder='Password'
                {...(isInputDisabled ? { disabled: isInputDisabled } : null)}
                styles={{ width: '100%' }}
                onInput={clearErrors}
              />
              <label class='form-error-label'>
                {validation.password.success ? '' : validation.password.errorMessage}
              </label>
              <label class='form-error-label'>
                {validation.submission.success ? '' : validation.submission.errorMessage}
              </label>
            </div>
          </GroupBox>
        </WndBody>
        <footer style='display: flex; justify-content: right; gap:0px'>
          <SocketConnectionStatus variant='short' />
          <ChatStatus variant='short' />
          <span style='width: 100%' />
          <button type='submit' {...(isInputDisabled ? { disabled: isInputDisabled } : null)}>
            Ok
          </button>
          <button type='reset' {...(isInputDisabled ? { disabled: isInputDisabled } : null)}>
            Clear
          </button>
        </footer>
      </WndView>
    </form>
  );
};
