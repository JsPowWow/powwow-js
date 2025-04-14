import { ObjectStore } from '@powwow-js/simple-store';
import { ILogger } from '../../../shared/Logger';
import {
  createStateMachine,
  enqueue,
  IStateMachine,
  StateMachineDefinition,
  StateMachineTransitionExecutor,
} from '@powwow-js/state-machine';
import { Nullable } from '@powwow-js/core';
import { WebSocketActor } from '../webSocket/webSocketActor';
import { listenSocketState, saveSocket } from './actionEffects';
import { WebSocketChatService } from '../../../services/WebSocketChatService';

export type ChatState = 'blank' | 'initialized' | 'authorized';

export type ChatStateTransitions = {
  initialize: { socketActor: WebSocketActor };
  connectionError: undefined;
  login: { username: string; password: string };
  logout: undefined;
};

type ChatData = {
  socketActor: Nullable<WebSocketActor>;
  logger?: ILogger;
};

export type ChatContext = ObjectStore<ChatData>;

const doLogin: StateMachineTransitionExecutor<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'login',
  ChatContext
> = async ({ context, data }) => {
  return new Promise((resolve, reject) => {
    const socket = context.get().socketActor?.context.get().socket;
    if (socket) {
      const service = new WebSocketChatService(socket);
      console.log('~~ logining...');
      service.login(
        { login: data.username, password: data.password },
        {
          onCall: (payload) => {
            console.log('~~ login OK', payload);
            resolve({ target: 'authorized' });
          },
          onError: () => {
            console.log('~~ login Error');
            reject(new Error('Login attempt Error'));
          },
        }
      );
    }
  });
};

const chatLogic: StateMachineDefinition<ChatState, ChatStateTransitions, ChatContext> = {
  initialState: 'blank',
  debug: true,
  states: {
    blank: {
      transitions: {
        initialize: {
          target: 'initialized',
        },
      },
    },
    initialized: {
      actions: {
        onEnter: enqueue(saveSocket, listenSocketState),
      },
      transitions: {
        login: doLogin,
        connectionError: {
          target: 'blank',
        },
      },
    },
    authorized: {
      transitions: {
        login: doLogin,
        connectionError: {
          target: 'blank',
        },
      },
    },
  },
};

export type ChatActor = IStateMachine<ChatState, ChatStateTransitions, ChatContext>;

const createChat = (options?: { logger: ILogger }): ChatActor => {
  return createStateMachine(chatLogic, new ObjectStore<ChatData>({ socketActor: null, logger: options?.logger }));
};

export default createChat;
