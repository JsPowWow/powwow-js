import { WndTitleBar } from '../../shared/components/WndTitleBar';
import { WndBody } from '../../shared/components/WndBody';
import { SocketConnectionStatus } from '../../widgets/SocketConnectionStatus';
import { ChatStatus } from '../../widgets/ChatStatus';
import { WndView } from '../../shared/components/WndView';

const AboutPage = () => {
  return (
    <WndView
      id='about-dialog'
      className='show glass'
      role='dialog'
      aria-labelledby='login dialog-title'
      styles={{ width: '60%', minWidth: '215px', maxWidth: '355px' }}
    >
      <WndTitleBar caption='😎 About v0.0.6' maximize={false} minimize={false} />
      <WndBody className='has-space' styles={{ height: '100%' }}>
        <h2 class='instruction instruction-primary' style='margin-bottom: 6px;'>
          It is reely Fun Chat
        </h2>
      </WndBody>
      <footer style='display: flex; justify-content: right; gap:0px'>
        <SocketConnectionStatus variant='short' />
        <ChatStatus variant='short' />
        <span style='width: 100%' />
        <button type='button'>Ok</button>
      </footer>
    </WndView>
  );
};
export default AboutPage;
