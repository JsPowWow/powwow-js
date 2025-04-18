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
      styles={{ width: '60%', minWidth: '215px', maxWidth: '355px', alignSelf: 'center', marginTop: '100px' }}
    >
      <WndTitleBar caption='😎 About v0.0.7' maximize={false} minimize={false} />
      <WndBody className='has-space' styles={{ height: '100%' }}>
        <h2 class='instruction instruction-primary' style='margin-bottom: 6px;'>
          It is reely Fun Chat
        </h2>
        The application was crafted using pure vanilla JavaScript; No external libraries were harmed
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
