import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { RemoteUser, User } from '../../../../models/user';

export const getOnlineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOnlineUsers',
  ChatContext,
  { users: RemoteUser[] }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getActiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('getOnlineUsers', payload);
            resolve({ target: 'authorized', data: payload });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('Something went wrong on "getOnlineUsers"'));
  });
};

export const getOfflineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOfflineUsers',
  ChatContext,
  { users: RemoteUser[] }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getInactiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('getOfflineUsers', payload);
            resolve({ target: 'authorized', data: payload });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('Something went wrong on "getOfflineUsers"'));
  });
};

export const subscribeExternalLoginUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'subscribeExternalLoginUsers',
  ChatContext,
  { user: User }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.notifyLogin({
          onCall: (payload) => {
            context.get().logger?.info('subscribeExternalLoginUsers', payload);
            resolve({ target: 'authorized', data: payload });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('Something went wrong on "subscribeExternalLoginUsers"'));
  });
};

export const subscribeExternalLogoutUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'subscribeExternalLogoutUsers',
  ChatContext,
  { user: User }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.notifyLogout({
          onCall: (payload) => {
            context.get().logger?.info('subscribeExternalLogoutUsers', payload);
            resolve({ target: 'authorized', data: payload });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        })
      )
      .getOrThrow(new Error('Something went wrong on "subscribeExternalLogoutUsers"'));
  });
};
