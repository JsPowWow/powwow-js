import { matchAction } from '@powwow-js/state-machine';
import { ChatActionEffect, ChatContext } from './ChatActor';
import { isValidUsersResponse } from '../../../services/validation';
import { Either, hasProperty, identity, Maybe, noop, UnknownRecord } from '@powwow-js/core';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { getItemByKey } from '../../../shared/persistence';
import { APP_STORAGE_KEY } from '../settings/constants';
import { User } from '../../../models/user.model';

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

export const clearChatUsers: ChatActionEffect = ({ context }) => context.get().store.set({ users: [] });

const updateByResponseUsers = (context: ChatContext, responseUsers: unknown) => {
  if (isValidUsersResponse(responseUsers)) {
    const normalizedUsers = responseUsers.filter((user) => user.login !== context.get().currentUser?.login);
    context.get().logger?.info('updateByOnlineUsers:', normalizedUsers.length);
    context.get().store.set(({ users }) => ({ users: [...users, ...normalizedUsers] }));
  }
};

export const setChatUsers: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'authorized' }, ({ owner, context }) => {
    owner.send('getOnlineUsers').then((result) => {
      if (result.status === 'success') {
        updateByResponseUsers(context, result.data?.users);
      }
    });

    owner.send('getOfflineUsers').then((result) => {
      if (result.status === 'success') {
        updateByResponseUsers(context, result.data?.users);
      }
    });
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

const isUserCredentials = (source: unknown): source is Required<User> =>
  hasProperty('login', source) && hasProperty('password', source);

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
