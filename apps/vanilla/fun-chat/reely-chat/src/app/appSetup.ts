import { setCreateSocketLogger } from '../shared/socket';
import { getLogger } from '../shared/Logger';
import { socketConnection } from '../services/socket';

export const setup = () => {
  setCreateSocketLogger(getLogger('SocketConnection')).setEnabled(true);
  socketConnection.send('connect');
};
