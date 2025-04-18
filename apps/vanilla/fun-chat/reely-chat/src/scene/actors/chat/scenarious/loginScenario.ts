import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { setItemByKey } from '../../../../shared/persistence';
import { APP_STORAGE_KEY } from '../../settings/constants';
import { Router } from '../../../../shared/routing/useRouter';

export const login: StateMachineTransition<ChatStateTransitions, 'ready', ChatState, 'login', ChatContext> = async ({
  context,
  data,
}) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => ({ service }))
      .map(({ service }) =>
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

              Router.navigate('/chat');

              resolve({ target: 'authorized' });
            },
            onError: (payload) => {
              reject(toErrorWithMessage(payload?.error));
            },
          }
        )
      )
      .getOrThrow(new Error('Something went wrong on "login" processing scenario'));
  });
};
