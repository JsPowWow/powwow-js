import { ObjectStore } from '@powwow-js/simple-store';
import { ILogger } from '../../../shared/Logger';
import { createStateMachine, enqueue, IStateMachine, StateMachineDefinition } from '@powwow-js/state-machine';
import { Nullable } from '@powwow-js/core';
import { WebSocketActor } from '../webSocket/webSocketActor';
import { login, initializeChatApiService, saveSocket, tryRestoreUserLogin, logout } from './actionEffects';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { User } from '../../../models/user.model';
import { Router } from '../../../shared/routing/useRouter';

export type ChatState = 'offline' | 'ready' | 'authorized';

export type ChatStateTransitions = {
  setReady: { socketActor: WebSocketActor };
  setOffline: undefined;
  login: { username: string; password: string };
  logout: undefined;
};

type ChatContextData = {
  socketActor: Nullable<WebSocketActor>;
  apiService: Nullable<WebSocketChatService>;
  logger?: ILogger;
  currentUser: Nullable<User>;
};

export type ChatContext = ObjectStore<ChatContextData>;

const chatLogic: StateMachineDefinition<ChatState, ChatStateTransitions, ChatContext> = {
  initialState: 'offline',
  debug: true,
  states: {
    offline: {
      transitions: {
        setReady: { target: 'ready' },
      },
      actions: {
        onExit: enqueue(saveSocket, initializeChatApiService),
      },
    },
    ready: {
      actions: {
        onEnter: enqueue(tryRestoreUserLogin),
      },
      transitions: {
        setOffline: { target: 'offline' },
        login,
      },
    },
    authorized: {
      actions: {
        onEnter: enqueue(() => {
          Router.navigate('/chat');
        }),
        // onExit: enqueue(() => {
        //   Router.navigate('/login');
        // }),
      },
      transitions: {
        setOffline: { target: 'offline' },
        logout,
      },
    },
  },
};

export type ChatActor = IStateMachine<ChatState, ChatStateTransitions, ChatContext>;

const createChat = (options?: { logger: ILogger }): ChatActor => {
  return createStateMachine(
    chatLogic,
    new ObjectStore<ChatContextData>({
      socketActor: null,
      apiService: null,
      logger: options?.logger,
      currentUser: null,
    })
  );
};

export default createChat;
