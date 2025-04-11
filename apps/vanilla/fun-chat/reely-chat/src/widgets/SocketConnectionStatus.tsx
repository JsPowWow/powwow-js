import { useSocketConnection } from '../services/socket/useSocketConnection';
import { ConnectionState } from '../shared/socket/webSocketActor';

const stateMap = {
  connecting: '🟡',
  online: '🟢',
  failed: '🔴',
  offline: '⚪️',
} satisfies Record<ConnectionState, string>;

export const SocketConnectionStatus = () => {
  const { state } = useSocketConnection();
  return `${state} ${stateMap[state]}`;
};
