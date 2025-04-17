import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { assertIsNonNullable, toErrorWithMessage } from '@powwow-js/core';
import { ExtendedUser } from '../../../../models/user.model';

export const getOnlineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOnlineUsers',
  ChatContext,
  { users: ExtendedUser[] }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    const service = context.get().apiService;
    assertIsNonNullable(service);

    service.getActiveUsers({
      onCall: (payload) => {
        context.get().logger?.info('getOnlineUsers', payload);
        resolve({ target: 'authorized', data: payload });
      },
      onError: (payload) => {
        reject(toErrorWithMessage(payload?.error));
      },
    });
  });
};

export const getOfflineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOfflineUsers',
  ChatContext,
  { users: ExtendedUser[] }
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    const service = context.get().apiService;
    assertIsNonNullable(service);

    service.getInactiveUsers({
      onCall: (payload) => {
        context.get().logger?.info('getOfflineUsers', payload);
        resolve({ target: 'authorized', data: payload });
      },
      onError: (payload) => {
        reject(toErrorWithMessage(payload?.error));
      },
    });
  });
};
