import { useSocketConnection } from '../scene/audience/useSocketConnection';
import { ConnectionState } from '../scene/actors/webSocket/webSocketActor';

const stateMap = {
  connecting: '🟡',
  online: '🟢',
  failed: '🔴',
  offline: '⚪️',
} satisfies Record<ConnectionState, string>;

interface SocketConnectionStatusProps {
  variant?: 'short' | 'normal';
}

export const SocketConnectionStatus = ({ variant = 'normal' }: SocketConnectionStatusProps) => {
  const { state } = useSocketConnection();
  if (variant === 'short') {
    return <span style='margin: 0 2px 0 2px'>{stateMap[state]}</span>;
  }
  return <span>{`${state} ${stateMap[state]}`}</span>;
};
