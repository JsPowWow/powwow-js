import { useSocketConnection } from '../state/socket/useSocketConnection';
import { ConnectionState } from '../state/socket/socketConnection';

const stateMap = {
  connecting: '🟡',
  online: '🟢',
  failed: '🔴',
  offline: '⚪️',
} satisfies Record<ConnectionState, string>;

export const SocketConnectionStatus = () => {
  const { state } = useSocketConnection();
  return ` ${state} ${stateMap[state]}`;
};
