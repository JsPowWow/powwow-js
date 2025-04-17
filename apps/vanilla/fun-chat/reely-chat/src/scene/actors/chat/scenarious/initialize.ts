import { ChatActionEffect } from '../ChatActor';
import { matchAction } from '@powwow-js/state-machine';
import { Maybe } from '@powwow-js/core';
import { WebSocketChatService } from '../../../../services/WebSocketChatService';

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
  });
