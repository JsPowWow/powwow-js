import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';

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
            // updateByResponseUsers(context, payload.users);
            // context.get().logger?.info('✅ offline users updated');
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
