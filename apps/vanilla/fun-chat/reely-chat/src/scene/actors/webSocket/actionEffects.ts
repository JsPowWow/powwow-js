import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { Maybe } from '@powwow-js/core';
import { ConnectionContext, ConnectionState, ConnectionStateTransitions } from './webSocketActor';
import createSocket from '../../../shared/createSocket';

type SocketConnectionActionEffect = StateMachineTransitionActionEffect<
  ConnectionStateTransitions,
  ConnectionState,
  ConnectionContext
>;

export const closeCurrentSocket: SocketConnectionActionEffect = ({ context }) => {
  const prefSocket = context.get().socket;
  if (prefSocket) {
    context.get().logger?.info('Closing existed socket');
    prefSocket.close();
  }
  context.set({ socket: null });
};

export const connect: SocketConnectionActionEffect = ({ context, owner }) => {
  createSocket(context.get().url, { logger: context.get().logger }).then((result) =>
    result.unwrap(
      ({ error }) => owner.send('connectionError', error),
      ({ socket }) => owner.send('connectionSuccess', socket)
    )
  );
};

export const saveUrl: SocketConnectionActionEffect = (action) =>
  matchAction(action).when({ by: 'connect' }, ({ context, data: url }) => url && context.set({ url }));

export const saveSocket: SocketConnectionActionEffect = (action) =>
  matchAction(action).when({ by: 'connectionSuccess' }, ({ context, data: socket }) =>
    context.set({ socket, error: null })
  );

export const saveError: SocketConnectionActionEffect = (action) =>
  matchAction(action).when({ by: 'connectionError' }, ({ context, data: error }) => context.set({ error }));

export const listenForClose: SocketConnectionActionEffect = ({ context, owner }) => {
  Maybe.from(context.get().socket).map((s) => {
    s.addEventListener(
      'close',
      (_event: Event) => {
        if (owner.state === 'online') {
          owner.send('disconnect');
        }
      },
      { once: true }
    );
  });
};
