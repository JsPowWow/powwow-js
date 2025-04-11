import { enqueue, logWithContext, StateMachine, StateMachineDefinition } from '@powwow-js/state-machine';
import { ObjectStore } from '@powwow-js/simple-store';
import { Nullable } from '@powwow-js/core';
import { closeCurrentSocket, connect, listenForClose, saveError, saveSocket } from './effects';

export type ConnectionState = 'offline' | 'connecting' | 'online' | 'failed';

export type ConnectionStateTransitions = {
  connect: undefined;
  connectionSuccess: WebSocket;
  connectionError: Error;
  disconnect: undefined;
};

export type ConnectionStateContext = {
  socket: Nullable<WebSocket>;
  error: Nullable<Error>;
};

export type ConnectionContext = ObjectStore<ConnectionStateContext>;

const socketConnectionLogic: StateMachineDefinition<ConnectionState, ConnectionStateTransitions, ConnectionContext> = {
  initialState: 'offline',
  debug: true,
  states: {
    offline: {
      actions: {
        onEnter: enqueue(closeCurrentSocket),
      },
      transitions: {
        connect: {
          target: 'connecting',
        },
      },
    },
    connecting: {
      actions: {
        onEnter: enqueue(closeCurrentSocket, connect),
      },
      transitions: {
        connectionSuccess: {
          target: 'online',
        },
        connectionError: {
          target: 'failed',
        },
        disconnect: {
          target: 'offline',
        },
      },
    },
    online: {
      actions: {
        onEnter: enqueue(saveSocket, listenForClose, logWithContext),
      },
      transitions: {
        connectionError: {
          target: 'failed',
        },
        disconnect: {
          target: 'offline',
        },
      },
    },
    failed: {
      actions: {
        onEnter: enqueue(saveError, logWithContext),
      },
      transitions: {
        connect: {
          target: 'connecting',
        },
        disconnect: {
          target: 'offline',
        },
      },
    },
  },
};

export const socketConnection = new StateMachine(
  socketConnectionLogic,
  new ObjectStore<ConnectionStateContext>({ socket: null, error: null })
);
