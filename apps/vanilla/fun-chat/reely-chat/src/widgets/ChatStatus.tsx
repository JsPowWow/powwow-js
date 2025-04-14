import { useChat } from '../scene/audience/useChat';
import { ChatState } from '../scene/actors/chat/ChatActor';

const stateMap = {
  ready: '🟡',
  authorized: '🟢',
  offline: '⚪️',
} satisfies Record<ChatState, string>;

interface ChatStatusProps {
  variant?: 'short' | 'normal';
}

export const ChatStatus = ({ variant = 'normal' }: ChatStatusProps) => {
  const { state } = useChat();
  if (variant === 'short') {
    return <span style='margin: 0 2px 0 2px'>{stateMap[state]}</span>;
  }
  return <span>{`${state} ${stateMap[state]}`}</span>;
};
