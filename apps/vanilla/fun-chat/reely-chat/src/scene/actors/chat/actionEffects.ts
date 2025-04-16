import { matchAction, StateMachineTransition, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from './ChatActor';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import {
  assertIsNonNullable,
  Either,
  hasProperty,
  identity,
  Maybe,
  noop,
  toErrorWithMessage,
  UnknownRecord,
} from '@powwow-js/core';
import { getItemByKey, setItemByKey } from '../../../shared/persistence';
import { User } from '../../../models/user.model';
import { Router } from '../../../shared/routing/useRouter';

type ChatActionEffect = StateMachineTransitionActionEffect<ChatStateTransitions, ChatState, ChatContext>;

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

const APP_STORAGE_KEY = 'reely-chat';

const isUserCredentials = (source: unknown): source is Required<User> =>
  hasProperty('login', source) && hasProperty('password', source);

export const initializeChatApiService: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'ready' }, ({ context }) => {
    Maybe.from(context.get().apiService).map((service) => service.dispose());

    Maybe.from(context.get().socketActor?.context.get().socket)
      .map((socket) => {
        return new WebSocketChatService(socket);
      })
      .map((apiService) => {
        context.set({ apiService });
        return apiService;
      })
      .map((apiService) => apiService.start());
  });

export const tryRestoreUserLogin: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'ready' }, ({ owner, context }) => {
    const persistedData = Maybe.from(getItemByKey(sessionStorage, APP_STORAGE_KEY).unwrap(noop, identity))
      .map((data) => Either.tryCatch((): UnknownRecord => JSON.parse(data)))
      .map((either) => either.unwrap(noop, identity))
      .getOrDefault({});

    if (isUserCredentials(persistedData)) {
      owner.send('login', { username: persistedData.login, password: persistedData.password }).then(() => {
        context.get().logger?.log('tryRestoreUserLogin')(`"${persistedData.login}" connection restored`);
      });
    }
  });

export const login: StateMachineTransition<ChatStateTransitions, 'ready', ChatState, 'login', ChatContext> = async ({
  context,
  data,
}) => {
  return new Promise((resolve, reject) => {
    const service = context.get().apiService;
    assertIsNonNullable(service);

    service.login(
      { login: data.username, password: data.password },
      {
        onCall: ({ user }) => {
          const currentUser = { ...user, password: data.password };
          // store current user
          context.set({ currentUser });

          // save user session info
          setItemByKey(sessionStorage, APP_STORAGE_KEY, JSON.stringify(currentUser));

          // save last user login
          setItemByKey(
            localStorage,
            APP_STORAGE_KEY,
            JSON.stringify({
              user: { login: user.login },
            })
          );

          resolve({ target: 'authorized' });
        },
        onError: (payload) => {
          reject(toErrorWithMessage(payload?.error));
        },
      }
    );
  });
};

export const logout: StateMachineTransition<
  ChatStateTransitions,
  'authorized',
  ChatState,
  'logout',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    const service = context.get().apiService;
    assertIsNonNullable(service);
    const currentUser = context.get().currentUser;
    assertIsNonNullable(currentUser);

    service.logout(currentUser, {
      onCall: (_payload) => {
        // clear current user
        context.set({ currentUser: null });

        // save user session info
        setItemByKey(sessionStorage, APP_STORAGE_KEY, JSON.stringify({}));

        // redirect to login
        Router.navigate('/login');

        resolve({ target: 'ready' });
      },
      onError: (payload) => {
        reject(toErrorWithMessage(payload?.error));
      },
    });
  });
};
