import { WndView } from '../shared/components/WndView';
import { WndTitleBar } from '../shared/components/WndTitleBar';
import { WndBody } from '../shared/components/WndBody';
import { WndStatusBar } from '../shared/components/WndStatusBar';
import { WndMenuBar } from '../shared/components/WndMenuBar';
import { useRouter } from '../shared/routing/useRouter';
import { CurrentPageInfoStatus } from '../widgets/CurrentPageInfoStatus';
import { SocketConnectionStatus } from '../widgets/SocketConnectionStatus';
import { useSocketConnection } from '../scene/audience/useSocketConnection';
import { ChatStatus } from '../widgets/ChatStatus';
import { useReconnectOnError } from '../scene/audience/useReconnectOnError';
import { useChat } from '../scene/audience/useChat';

export const AppWindow = ({ children }: { children?: unknown[] }) => {
  const { navigate } = useRouter();
  const { connect, disconnect } = useSocketConnection();
  const chat = useChat();

  // TODO AR get interval from settings
  useReconnectOnError(7000);

  return (
    <WndView styles={{ width: '100%' }}>
      <WndTitleBar caption='🥸 Reely Chat Demo' />
      <WndMenuBar
        items={[
          {
            caption: 'File',
            menu: [
              <a href='/login' onClick={navigate}>
                Login <span>Ctrl+L</span>
              </a>,
              <label onclick={() => chat.send('logout')}>
                Logout <span>Ctrl+D</span>
              </label>,
              <label onclick={connect}>
                Connect <span>Ctrl+N</span>
              </label>,
              <label onclick={disconnect}>
                Disconnect <span>Ctrl+C</span>
              </label>,
              // {
              //   divider: true,
              //   content: (
              //     <a href='#menubar'>
              //       Save As... <span>Ctrl+Shift+S</span>
              //     </a>
              //   ),
              // },
              // <a href='#menubar'>Exit</a>,
            ],
          },
          // {
          //   caption: 'Edit',
          //   menu: [
          //     <a href='#menubar'>Undo</a>,
          //     <a href='#menubar'>Copy</a>,
          //     <a href='#menubar'>Cut</a>,
          //     {
          //       divider: true,
          //       content: <a href='#menubar'>Paste</a>,
          //     },
          //     <a href='#menubar'>Delete</a>,
          //     <a href='#menubar'>Find...</a>,
          //     <a href='#menubar'>Replace...</a>,
          //     <a href='#menubar'>Go to...</a>,
          //   ],
          // },
          {
            caption: 'View',
            menu: [
              <a href='/chat' onclick={navigate}>
                Chat...
              </a>,
              <button type='button'>Zoom In</button>,
              <button type='button'>Zoom Out</button>,
              <button type='button'>Status Bar</button>,
            ],
          },
          {
            caption: 'Help',
            menu: [
              <a href='/help' onclick={navigate}>
                View Help
              </a>,
              <a href='/about' onclick={navigate}>
                About
              </a>,
            ],
          },
        ]}
      />
      <WndBody
        className='has-space desktop'
        styles={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </WndBody>
      <WndStatusBar
        items={['Press F1 for help', <CurrentPageInfoStatus />, <SocketConnectionStatus />, <ChatStatus />]}
      />
    </WndView>
  );
};
