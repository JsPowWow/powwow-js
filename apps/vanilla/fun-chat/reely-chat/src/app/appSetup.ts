import { socketConnection } from '../state/socket/socketConnection';
import { setCreateSocketLogger } from '../shared/createSocket';
import { getLogger } from '../shared/Logger';

export const setup = () => {
  setCreateSocketLogger(getLogger('SocketConnection')).setEnabled(true);
  socketConnection.send('connect');
};
