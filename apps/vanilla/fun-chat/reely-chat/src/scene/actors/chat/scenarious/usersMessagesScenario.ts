import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { updateChatUser } from '../actionEffects';

export const getUserMessages: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'getUserMessages',
  ChatContext
> = async ({ context, data: user }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        return service.getUserMessages(user, {
          onCall: (payload) => {
            context.get().logger?.info(`⬅️ got "${user.login}" messages 💬`, payload.messages);

            if (payload.messages.length > 0) {
              payload.messages.forEach((message) => {
                Maybe.from(context.get().store.get().users.get(message.from)).unwrap(
                  (chatUser) => {
                    chatUser.messages.push(message);
                    updateChatUser(context, chatUser);
                    context.get().logger?.info(`✅ "${chatUser.login}" messages updated`);
                  },
                  () => context.get().logger?.warn(`🆘 "${user.login}" not found on "getUserMessages" processing`)
                );
              });
            }
            resolve({ target: 'authorized' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        });
      })
      .getOrThrow(new Error('📛 Something went wrong on "getUserMessages"'));
  });
};

export const subscribeExternalUserMessages: StateMachineTransition<
  ChatStateTransitions,
  ChatState,
  ChatState,
  'subscribeExternalUserMessages',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => {
        context.get().logger?.info("➡️ subscribe external user's message notification(s)...");
        return service.notifySend({
          onCall: (payload) => {
            context.get().logger?.info('⬅️ external user send You a message 💬', payload);
            // TODO HERE I.m stopped
            // updateByResponseUsers(owner, context, [payload.user]);
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
