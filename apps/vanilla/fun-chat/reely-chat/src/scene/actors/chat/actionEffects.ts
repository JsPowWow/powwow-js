import { matchAction } from '@powwow-js/state-machine';
import { ChatActionEffect, ChatContext } from './ChatActor';
import { Either, hasProperty, identity, Maybe, noop, UnknownRecord } from '@powwow-js/core';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { getItemByKey } from '../../../shared/persistence';
import { APP_STORAGE_KEY } from '../settings/constants';
import { ChatUser, User } from '../../../models/user';
import { Router } from '../../../shared/routing/useRouter';

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

export const clearChatUsers: ChatActionEffect = ({ context }) =>
  context.get().store.set(({ users }) => {
    users.clear();
  });

export const initializeChatUsers: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'authorized' }, ({ owner }) => {
    owner.send('subscribeExternalLoginUsers');

    owner.send('subscribeExternalLogoutUsers');

    owner.send('getOnlineUsers');

    owner.send('getOfflineUsers');

    owner.send('subscribeExternalUserMessages');
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
    // .getOrThrow(); // TODO throw
  });

export const tryRestoreUserLogin: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'ready' }, ({ owner, context }) => {
    const persistedData = Maybe.from(getItemByKey(sessionStorage, APP_STORAGE_KEY).unwrap(noop, identity))
      .map((data) => Either.tryCatch((): UnknownRecord => JSON.parse(data)))
      .map((either) => either.unwrap(noop, identity))
      .getOrDefault({});

    if (isUserCredentials(persistedData)) {
      context.get().logger?.log('🔄 trying to restore user connection')('...');
      owner.send('login', { username: persistedData.login, password: persistedData.password }).then((result) => {
        console.log('ssss', result.status, persistedData);
        if (result.status === 'success') {
          context.get().logger?.log('🔄 trying to restore user connection')(`✅ "${persistedData.login}" restored`);
        }
        if (result.status === 'error') {
          context.get().logger?.log('🔄 trying to restore user connection')(
            `❌ "${persistedData.login}" ${result.error.message}`
          );
          Router.navigate('/login');
        }
      });
    }
  });

export const updateChatUser = (context: ChatContext, chatUser: ChatUser) => {
  context.get().store.get().users.set(chatUser.login, chatUser);
};

function isUserCredentials(source: unknown): source is Required<User> {
  return hasProperty('login', source) && hasProperty('password', source);
}
