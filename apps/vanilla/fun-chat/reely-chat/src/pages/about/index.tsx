import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { SocketConnectionStatus } from '../../widgets/SocketConnectionStatus';
import { ChatStatus } from '../../widgets/ChatStatus';
import { WndView } from '../../shared/components/WndView';
import { Router } from '../../shared/routing/useRouter';

const AboutPage = () => {
  return (
    <WndView
      id='about-dialog'
      className='show glass dialog'
      aria-labelledby='login dialog-title'
      styles={{ width: '60%', minWidth: '315px', maxWidth: '355px', alignSelf: 'center', marginTop: '100px' }}
    >
      <WndTitleBar caption='😎 About v0.0.9' maximize={false} minimize={false} />
      <WndBody className='has-space' styles={{ height: '100%' }}>
        <fieldset>
          <h2 class='instruction instruction-primary' style='margin-bottom: 6px;'>
            It is reely Fun Chat
          </h2>
          <legend></legend>
          <div class='field-row'>
            <input type='checkbox' id='row1' checked disabled />
            <label for='row1' styles={{ opacity: 1 }}>
              It was crafted using pure JavaScript
            </label>
          </div>
          <div class='field-row'>
            <input type='checkbox' id='row2' checked disabled />
            <label for='row2' styles={{ opacity: 1 }}>
              No external libraries were harmed
            </label>
          </div>
          <div class='field-row'>
            <input type='checkbox' id='row3' checked disabled />
            <label for='row3' styles={{ opacity: 1 }}>
              <span>
                The <strong>@powwow-js</strong> is "reely" used
              </span>
            </label>
          </div>
          <div class='field-row'>
            <input type='checkbox' id='row4' checked disabled />
            <label for='row4' styles={{ opacity: 1 }}>
              This is a checkbox 😂
            </label>
          </div>
        </fieldset>
      </WndBody>
      <footer style='display: flex; justify-content: right; gap:0px'>
        <SocketConnectionStatus variant='short' />
        <ChatStatus variant='short' />
        <span style='width: 100%' />
        <button type='button' onclick={() => Router.back()}>
          {Router.getLength() > 0 ? 'Back' : 'Ok'}
        </button>
      </footer>
    </WndView>
  );
};
export default AboutPage;
