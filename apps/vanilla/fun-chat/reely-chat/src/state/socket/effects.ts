import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { Maybe } from '@powwow-js/core';
import { ConnectionContext, ConnectionState, ConnectionStateTransitions } from './socketConnection';
import createSocket from '../../shared/createSocket';

type SocketConnectionActionEffect = StateMachineTransitionActionEffect<
  ConnectionStateTransitions,
  ConnectionState,
  ConnectionContext
>;

export const closeCurrentSocket: SocketConnectionActionEffect = ({ owner }) => {
  Maybe.from(owner.context.get().socket).map((s) => {
    console.log('Closing existed socket:', s);
    s.close();
  });
  owner.context.set({ socket: null });
};

// TODO AR get url from settings
const chatUrl: string = import.meta.env.VITE_MIK_API_URL;

export const connect: SocketConnectionActionEffect = ({ owner }) => {
  createSocket(chatUrl).then((result) =>
    result.unwrap(
      ({ error }) => owner.send('connectionError', error),
      ({ socket }) => owner.send('connectionSuccess', socket)
    )
  );
};

export const saveSocket: SocketConnectionActionEffect = (action) =>
  matchAction(action).when({ by: 'connectionSuccess' }, ({ owner, data: socket }) =>
    owner.context.set({ socket, error: null })
  );

export const saveError: SocketConnectionActionEffect = (action) =>
  matchAction(action).when({ by: 'connectionError' }, ({ owner, data: error }) => owner.context.set({ error }));

export const listenForClose: SocketConnectionActionEffect = ({ owner }) => {
  Maybe.from(owner.context.get().socket).map((s) => {
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
