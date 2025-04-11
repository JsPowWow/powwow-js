import { WndView } from '../../shared/components/WndView';
import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { GroupBox } from '../../shared/components/GroupBox';
import { assertIsInstanceOf } from '@powwow-js/core';
import { useState } from '@powwow-js/reely';
import {
  SUCCESS,
  validateUserNameFormData,
  validateUserPasswordFormData,
  ValidationResult,
} from '../../models/validation';

const NO_ERRORS = Object.freeze({ username: SUCCESS, password: SUCCESS });
const LoginPage = () => {
  const [validation, setValidation] = useState<{ username: ValidationResult; password: ValidationResult }>(NO_ERRORS);

  const clearErrors = () => setValidation(NO_ERRORS);

  const handleSubmit = (event: SubmitEvent) => {
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
                styles={{ width: '100%' }}
                onInput={clearErrors}
              />
              <label class='form-error-label'>
                {validation.password.success ? '' : validation.password.errorMessage}
              </label>
            </div>
          </GroupBox>
        </WndBody>
        <footer style='display: flex; justify-content: center; gap:10px'>
          <button type='submit'>Ok</button>
          <button type='reset'>Clear</button>
        </footer>
      </WndView>
    </form>
  );
};
export default LoginPage;

// <div class="window active is-bright" id="dialog-demo" role="dialog" aria-labelledby="dialog-title">
//   <div class="title-bar">
//     <div class="title-bar-text" id="dialog-title">Problem Diagnostics</div>
//     <div class="title-bar-controls">
//       <button aria-label="Close" onclick="history.back()"></button>
//     </div>
//   </div>
//   <div class="window-body has-space">
//     <h2 class="instruction instruction-primary">Identifying your problem...</h2>
//     <div role="progressbar" class="marquee"></div>
//   </div>
//   <footer style="text-align: right">
//     <button onclick="history.back()">Cancel</button>
//   </footer>
// </div>
