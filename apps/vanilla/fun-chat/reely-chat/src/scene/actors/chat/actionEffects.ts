import { matchAction } from '@powwow-js/state-machine';
import { ChatActionEffect, ChatContext } from './ChatActor';
import { Either, hasProperty, identity, Maybe, noop, UnknownRecord } from '@powwow-js/core';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { getItemByKey } from '../../../shared/persistence';
import { APP_STORAGE_KEY } from '../settings/constants';
import { isValidRemoteUsers, User } from '../../../models/user';

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

export const clearChatUsers: ChatActionEffect = ({ context }) =>
  context.get().store.set(({ users }) => {
    users.clear();
  });

export const getChatUsers: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'authorized' }, ({ owner }) => {
    owner.send('subscribeExternalLoginUsers');

    owner.send('subscribeExternalLogoutUsers');

    owner.send('getOnlineUsers');

    owner.send('getOfflineUsers');
  });

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
        context.get().logger?.log('🔄 try restore user login')(`✔️ "${persistedData.login}" restored`);
      });
    }
  });

function isUserCredentials(source: unknown): source is Required<User> {
  return hasProperty('login', source) && hasProperty('password', source);
}

export function updateByResponseUsers(context: ChatContext, responseUsers: unknown) {
  if (isValidRemoteUsers(responseUsers)) {
    const normalizedUsers = responseUsers.filter((user) => user.login !== context.get().currentUser?.login);
    context.get().store.set(({ users }) => {
      normalizedUsers.forEach((user) => {
        users.set(user.login, user);
      });
      return {
        users,
      };
    });
  } else {
    context.get().logger?.warn('🆘 updateByResponseUsers:not a "responseUsers":', responseUsers);
  }
}
