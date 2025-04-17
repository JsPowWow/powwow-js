import { Chat, chatLogger, SocketConnection, socketConnectionLogger } from './actors';
import { runActionEffect } from '@powwow-js/state-machine';

export const setupScene = (): void => {
  socketConnectionLogger.setEnabled(true);
  chatLogger.setEnabled(true);

  SocketConnection.on(
    'stateChanged',
    runActionEffect()
      .when({ to: 'offline' }, () => Chat.state !== 'offline' && Chat.send('setOffline'))
      .when({ to: 'failed' }, () => Chat.state !== 'offline' && Chat.send('setOffline'))
      .when({ to: 'online' }, () => Chat.send('setReady', { socketActor: SocketConnection })).invokeAction

    //  ...or alternative way
    //   (action) => {
    //   matchAction(action)
    //     .when({ to: 'offline' }, () => chatActor.send('setOffline'))
    //     .when({ to: 'failed' }, () => chatActor.send('setOffline'))
    //     .when({ to: 'online' }, () => chatActor.send('initialize', { socketActor }));
    // }
  );

  SocketConnection.send('connect');
};
