import { Chat, chatLogger, SocketConnection, socketConnectionLogger } from './actors';

export const setupScene = (): void => {
  socketConnectionLogger.setEnabled(true);
  chatLogger.setEnabled(true);

  SocketConnection.send('connect');
  Chat.send('initialize', { socketActor: SocketConnection });
};
