import { ObjectStore } from '@powwow-js/simple-store';
import { ILogger } from '../../../shared/Logger';
import { createStateMachine, enqueue, IStateMachine, StateMachineDefinition } from '@powwow-js/state-machine';
import { Nullable } from '@powwow-js/core';
import { WebSocketActor } from '../webSocket/webSocketActor';
import { initializeChatApiService, saveSocket } from './actionEffects';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { User } from '../../../models/user.model';

export type ChatState = 'offline' | 'ready' | 'authorized';

export type ChatStateTransitions = {
  setReady: { socketActor: WebSocketActor };
  setOffline: undefined;
  setAuthorized: User;
};

type ChatContextData = {
  socketActor: Nullable<WebSocketActor>;
  apiService: Nullable<WebSocketChatService>;
  logger?: ILogger;
};

export type ChatContext = ObjectStore<ChatContextData>;

const chatLogic: StateMachineDefinition<ChatState, ChatStateTransitions, ChatContext> = {
  initialState: 'offline',
  debug: true,
  states: {
    offline: {
      transitions: {
        setReady: {
          target: 'ready',
        },
      },
    },
    ready: {
      actions: {
        onEnter: enqueue(saveSocket, initializeChatApiService),
      },
      transitions: {
        setOffline: {
          target: 'offline',
        },
        setAuthorized: {
          target: 'authorized',
        },
      },
    },
    authorized: {
      transitions: {
        setOffline: {
          target: 'offline',
        },
      },
    },
  },
};

export type ChatActor = IStateMachine<ChatState, ChatStateTransitions, ChatContext>;

const createChat = (options?: { logger: ILogger }): ChatActor => {
  return createStateMachine(
    chatLogic,
    new ObjectStore<ChatContextData>({ socketActor: null, apiService: null, logger: options?.logger })
  );
};

export default createChat;
