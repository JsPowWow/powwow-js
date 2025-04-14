import { createStateMachine, enqueue, IStateMachine, StateMachineDefinition } from '@powwow-js/state-machine';
import { ObjectStore } from '@powwow-js/simple-store';
import { Nullable } from '@powwow-js/core';
import { closeCurrentSocket, connect, listenForClose, saveError, saveSocket, saveUrl } from './actionEffects';
import { ILogger } from '../../../shared/Logger';

export type ConnectionState = 'offline' | 'connecting' | 'online' | 'failed';

export type ConnectionStateTransitions = {
  disconnect: undefined;
  connect: undefined;
  connectionSuccess: WebSocket;
  connectionError: Error;
};

type ConnectionData = {
  url: string;
  socket: Nullable<WebSocket>;
  error: Nullable<Error>;
  logger?: ILogger;
};

export type ConnectionContext = ObjectStore<ConnectionData>;

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
        onEnter: enqueue(saveUrl, closeCurrentSocket, connect),
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
        onEnter: enqueue(saveSocket, listenForClose),
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
        onEnter: enqueue(saveError),
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

export type WebSocketActor = IStateMachine<ConnectionState, ConnectionStateTransitions, ObjectStore<ConnectionData>>;

const createSocketConnection = (url: string, options?: { logger: ILogger }): WebSocketActor =>
  createStateMachine(
    socketConnectionLogic,
    new ObjectStore<ConnectionData>({ socket: null, error: null, url: url, logger: options?.logger })
  );

export default createSocketConnection;
