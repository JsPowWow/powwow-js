import { IStateMachine, StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { ChatUser, isValidRemoteUsers, RemoteUser } from '../../../../models/user';
import { updateChatUser } from '../actionEffects';

export const getOnlineUsers: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getOnlineUsers',
  ChatContext
> = async ({ owner, context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getActiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ got online users', payload);
            const updated = updateByResponseUsers(owner, context, payload.users);
            context.get().logger?.info('✅ online users updated: ', updated.length);

            context.get().logger?.info(`➡️ requesting online user's messages...`);
            updated.forEach((user) => {
              owner.send('getUserMessages', user);
            });

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
> = async ({ owner, context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) =>
        service.getInactiveUsers({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ got offline users', payload);
            const updated = updateByResponseUsers(owner, context, payload.users);
            context.get().logger?.info('✅ offline users updated', updated.length);

            context.get().logger?.info(`➡️ requesting offline user's messages...`);
            updated.forEach((user) => {
              owner.send('getUserMessages', user);
            });

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
> = async ({ owner, context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        context.get().logger?.info("➡️ subscribe external user's login notification(s)...");
        return service.notifyLogin({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ external user did login 🟢', payload);
            const updated = updateByResponseUsers(owner, context, [payload.user]);
            context.get().logger?.info(`✅ "${payload.user.login}" updated`, updated);

            context.get().logger?.info(`➡️ requesting "${payload.user.login}" messages...`);
            owner.send('getUserMessages', payload.user);

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
> = async ({ owner, context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        context.get().logger?.info("➡️ subscribe external user's logout notification(s)...");
        return service.notifyLogout({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ external user did logout ⚪', payload);
            updateByResponseUsers(owner, context, [payload.user]);
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

function updateByResponseUsers(
  _owner: IStateMachine<ChatState, ChatStateTransitions, ChatContext>,
  context: ChatContext,
  responseUsers: RemoteUser[]
): ChatUser[] {
  const updatedUsers: ChatUser[] = [];
  if (isValidRemoteUsers(responseUsers)) {
    const normalizedUsers: ChatUser[] = responseUsers
      .filter((user) => user.login !== context.get().currentUser?.login)
      .map((remote): ChatUser => {
        return {
          login: remote.login,
          isLogined: remote.isLogined,
          messages: [],
        };
      });

    context.get().store.set(({ users }) => {
      normalizedUsers.forEach((chatUser) => {
        updateChatUser(context, chatUser);
        updatedUsers.push(chatUser);
      });

      return {
        users,
      };
    });
  } else {
    context.get().logger?.warn('🆘 updateByResponseUsers:not a "responseUsers":', responseUsers);
  }
  return updatedUsers;
}
