import { WndView } from '../shared/components/WndView';
import { WndTitleBar } from '../shared/components/WndTitleBar';
import { WndBody } from '../shared/components/WndBody';
import { WndStatusBar } from '../shared/components/WndStatusBar';
import { WndMenuBar } from '../shared/components/WndMenuBar';
import { useRouter } from '../shared/routing/Router';
import { CurrentPageInfoStatus } from '../widgets/CurrentPageInfoStatus';

export const AppWindow = ({ children }: { children?: unknown[] }) => {
  const { navigate } = useRouter();
  return (
    <WndView styles={{ width: '100%', height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <WndTitleBar caption='🥸 Reely Chat Demo' />
      <WndMenuBar
        items={[
          {
            caption: 'File',
            menu: [
              <a href='/login' onClick={navigate}>
                Login <span>Ctrl+L</span>
              </a>,
              <a href='#menubar'>
                Save <span>Ctrl+S</span>
              </a>,
              {
                divider: true,
                content: (
                  <a href='#menubar'>
                    Save As... <span>Ctrl+Shift+S</span>
                  </a>
                ),
              },
              <a href='#menubar'>Exit</a>,
            ],
          },
          {
            caption: 'Edit',
            menu: [
              <a href='#menubar'>Undo</a>,
              <a href='#menubar'>Copy</a>,
              <a href='#menubar'>Cut</a>,
              {
                divider: true,
                content: <a href='#menubar'>Paste</a>,
              },
              <a href='#menubar'>Delete</a>,
              <a href='#menubar'>Find...</a>,
              <a href='#menubar'>Replace...</a>,
              <a href='#menubar'>Go to...</a>,
            ],
          },
          {
            caption: 'View',
            menu: [<button>Zoom In</button>, <button>Zoom Out</button>, <a href='#menubar'>Status Bar</a>],
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
      <WndBody className='has-space desktop' styles={{ height: '100%' }}>
        {children}
      </WndBody>
      <WndStatusBar items={['Press F1 for help', <CurrentPageInfoStatus />, 'CPU Usage: 35%']} />
    </WndView>
  );
};
