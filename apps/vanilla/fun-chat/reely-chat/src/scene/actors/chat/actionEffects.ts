import { matchAction } from '@powwow-js/state-machine';
import { ChatActionEffect } from './ChatActor';
import { isValidUsersResponse } from '../../../services/validation';

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

export const getChatUsers: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'authorized' }, ({ owner, context }) => {
    owner.send('getOnlineUsers').then((result) => {
      if (result.status === 'success') {
        const users = result.data?.users;
        if (isValidUsersResponse(users)) {
          context.get().logger?.info('updateOnlineUsers', users);
          context.get().users.set({ online: users });
        }
      }
    });

    owner.send('getOfflineUsers').then((result) => {
      if (result.status === 'success') {
        const users = result.data?.users;
        if (isValidUsersResponse(users)) {
          context.get().logger?.info('updateOfflineUsers', users);
          context.get().users.set({ offline: users });
        }
      }
    });
  });
