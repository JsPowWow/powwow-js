import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from './ChatActor';
import { WebSocketChatService } from '../../../services/WebSocketChatService';
import { Maybe } from '@powwow-js/core';

type ChatActionEffect = StateMachineTransitionActionEffect<ChatStateTransitions, ChatState, ChatContext>;

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'setReady' }, ({ context, data: { socketActor } }) => {
    context.set({ socketActor });
  });

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
