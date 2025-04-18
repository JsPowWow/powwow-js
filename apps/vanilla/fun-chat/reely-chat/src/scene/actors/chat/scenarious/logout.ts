import { StateMachineTransition } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from '../ChatActor';
import { Maybe, toErrorWithMessage } from '@powwow-js/core';
import { setItemByKey } from '../../../../shared/persistence';
import { Router } from '../../../../shared/routing/useRouter';
import { APP_STORAGE_KEY } from '../../settings/constants';

export const logout: StateMachineTransition<
  ChatStateTransitions,
  'authorized',
  ChatState,
  'logout',
  ChatContext
> = async ({ context }) => {
  return new Promise((resolve, reject) => {
    Maybe.some(context.get().apiService)
      .map((service) => ({ service }))
      .map(({ service }) => ({
        service,
        currentUser: Maybe.some(context.get().currentUser).getOrThrow(),
      }))
      .map(({ service, currentUser }) => {
        service.logout(currentUser, {
          onCall: (_payload) => {
            // clear current user
            context.set({ currentUser: null });

            // save user session info
            setItemByKey(sessionStorage, APP_STORAGE_KEY, JSON.stringify({}));

            // redirect to login page
            Router.navigate('/login');

            resolve({ target: 'ready' });
          },
          onError: (payload) => {
            reject(toErrorWithMessage(payload?.error));
          },
        });
        return service;
      })
      .getOrThrow(new Error('Something went wrong on "logout" processing scenario'));
  });
};
