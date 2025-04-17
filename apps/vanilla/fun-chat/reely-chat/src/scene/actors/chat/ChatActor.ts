import { ObjectStore } from '@powwow-js/simple-store';
import { ILogger } from '../../../shared/Logger';
import {
  createStateMachine,
  enqueue,
  IStateMachine,
  StateMachineDefinition,
  StateMachineTransitionActionEffect,
} from '@powwow-js/state-machine';
import { Nullable } from '@powwow-js/core';
import { WebSocketActor } from '../webSocket/webSocketActor';
import { getChatUsers, saveSocket } from './actionEffects';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { ExtendedUser, User } from '../../../models/user.model';
import { login } from './scenarious/login';
import { logout } from './scenarious/logout';
import { tryRestoreUserLogin } from './scenarious/reconnect';
import { initializeChatApiService } from './scenarious/initialize';
import { getOfflineUsers, getOnlineUsers } from './scenarious/getUsers';

export type ChatState = 'offline' | 'ready' | 'authorized';

export type ChatStateTransitions = {
  setReady: { socketActor: WebSocketActor };
  setOffline: undefined;
  login: { username: string; password: string };
  getOnlineUsers: undefined;
  getOfflineUsers: undefined;
  logout: undefined;
};

type UsersStore = { online: ExtendedUser[]; offline: ExtendedUser[] };

type ChatContextData = {
  socketActor: Nullable<WebSocketActor>;
  apiService: Nullable<WebSocketChatService>;
  logger?: ILogger;
  currentUser: Nullable<User>;
  users: ObjectStore<UsersStore>;
};

export type ChatContext = ObjectStore<ChatContextData>;

export type ChatActionEffect = StateMachineTransitionActionEffect<ChatStateTransitions, ChatState, ChatContext>;

const chatLogic: StateMachineDefinition<ChatState, ChatStateTransitions, ChatContext> = {
  initialState: 'offline',
  debug: true,
  states: {
    offline: {
      transitions: { setReady: { target: 'ready' } },
    },
    ready: {
      actions: { onEnter: enqueue(saveSocket, initializeChatApiService, tryRestoreUserLogin) },
      transitions: {
        setOffline: { target: 'offline' },
        login,
      },
    },
    authorized: {
      actions: {
        onEnter: enqueue(
          // () => {
          //   Router.navigate('/chat');
          // }
          getChatUsers
        ),
        // TODO stay in chat, indicate reconnection ?
        // onExit: enqueue(() => {
        //   Router.navigate('/login');
        // }),
      },
      transitions: {
        getOnlineUsers: getOnlineUsers,
        getOfflineUsers: getOfflineUsers,
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
      users: new ObjectStore<UsersStore>({
        online: [],
        offline: [],
      }),
    })
  );
};

export default createChat;
