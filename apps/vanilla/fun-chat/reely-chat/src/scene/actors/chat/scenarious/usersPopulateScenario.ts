import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { updateByResponseUsers } from '../actionEffects';

export const getOnlineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOnlineUsers',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getActiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('◀️ got online users', payload);
            updateByResponseUsers(context, payload.users);
            context.get().logger?.info('✅ online users updated');
            resolve({ target: 'authorized' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('📛 Something went wrong on "getOnlineUsers"'));
  });
};

export const getOfflineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOfflineUsers',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getInactiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('◀️ got offline users', payload);
            updateByResponseUsers(context, payload.users);
            context.get().logger?.info('✅ offline users updated');
            resolve({ target: 'authorized' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('📛 Something went wrong on "getOfflineUsers"'));
  });
};

export const subscribeExternalLoginUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'subscribeExternalLoginUsers',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        context.get().logger?.info("➡️ subscribe external user's login notification(s)...");
        return service.notifyLogin({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ external user did login 🟢', payload);
            updateByResponseUsers(context, [payload.user]);
            resolve({ target: 'authorized' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        });
      })
      .getOrThrow(new Error('📛 Something went wrong on "subscribeExternalLoginUsers"'));
  });
};

export const subscribeExternalLogoutUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'subscribeExternalLogoutUsers',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        context.get().logger?.info("➡️ subscribe external user's logout notification(s)...");
        return service.notifyLogout({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ external user did logout ⚪', payload);
            updateByResponseUsers(context, [payload.user]);
            resolve({ target: 'authorized' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        });
      })
      .getOrThrow(new Error('📛 Something went wrong on "subscribeExternalLogoutUsers"'));
  });
};
