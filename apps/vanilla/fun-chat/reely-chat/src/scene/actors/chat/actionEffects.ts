import { matchAction, StateMachineTransitionActionEffect } from '@powwow-js/state-machine';
import { ChatContext, ChatState, ChatStateTransitions } from './ChatActor';
import { assertIsNonNullable } from '@powwow-js/core';

type ChatActionEffect = StateMachineTransitionActionEffect<ChatStateTransitions, ChatState, ChatContext>;

export const saveSocket: ChatActionEffect = (action) =>
  matchAction(action).when({ by: 'initialize' }, ({ context, data: { socketActor } }) => context.set({ socketActor }));

export const listenSocketState: ChatActionEffect = ({ owner: chatActor }) => {
  const socketActor = chatActor.context.get().socketActor;
  assertIsNonNullable(socketActor, 'socketActor');

  // TODO AR UNSUBSCRIBE !!!!!
  socketActor.on('stateChanged', (action) => {
    matchAction(action)
      .when({ to: 'offline' }, () => chatActor.send('connectionError'))
      .when({ to: 'failed' }, () => chatActor.send('connectionError'))
      .when({ to: 'online' }, () => chatActor.send('initialize', { socketActor }));
  });
};
