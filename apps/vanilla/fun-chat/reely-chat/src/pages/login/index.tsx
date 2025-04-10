import { WndView } from '../../shared/components/WndView';
import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { GroupBox } from '../../shared/components/GroupBox';
import { assertIsInstanceOf } from '@powwow-js/core';
import { useState } from '@powwow-js/reely';

const LoginPage = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    assertIsInstanceOf(HTMLFormElement, event.target);
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    if (!username || username.length < 4) {
      setErrors((errors) => [...errors, 'Username is required to be min 4 chars']);
    }
    if (!password || password.length < 4) {
      setErrors((errors) => [...errors, 'Password is required to be min 4 chars']);
    }
  };

  console.log('~~ errors', errors);

  return (
    <WndView
      className='is-bright show'
      id='login-dialog'
      role='dialog'
      aria-labelledby='dialog-title'
      styles={{ width: '60%' }}
    >
      <form onSubmit={handleSubmit}>
        <WndTitleBar caption='🔰 Login' maximize={false} minimize={false} />
        <WndBody className='has-space' styles={{ height: '100%' }}>
          <GroupBox caption='Authorization' styles={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div styles={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '5px' }}>
              <label for='login-username'>Name:</label>
              <input
                id='login-username'
                type='text'
                name='username'
                placeholder='Username'
                styles={{ width: '100%' }}
              />
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
              />
              {errors.length > 0 && <label style='color: red;'>{errors.join('\n')}</label>}
            </div>
          </GroupBox>
        </WndBody>
        <footer style='display: flex; justify-content: right; gap:10px'>
          <button type='submit'>Ok</button>
          <button type='button'>Clear</button>
        </footer>
      </form>
    </WndView>
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
