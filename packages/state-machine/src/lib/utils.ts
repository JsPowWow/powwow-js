import { StateMachineState, StateMachineTransitionAction, StateMachineTransitionActionEffect } from './types';
import { EventsMap, EventType } from '@powwow-js/emitter';
import { hasSome } from '@powwow-js/nullable';

export const logTransitionAction =
  (options?: { withContext?: boolean; withData?: boolean }) =>
  <Transitions extends EventsMap, State extends StateMachineState, Context extends NonNullable<unknown>>(
    action: StateMachineTransitionAction<Transitions, State, Context>
  ) => {
    const { type, to, from, by, data, owner } = action;
    const dataString = options?.withData === true ? `${hasSome(data) ? JSON.stringify(data) : '<no-data>'}` : '';
    const contextString = options?.withContext === true ? `with  ${JSON.stringify(owner.context)}` : '';
    switch (type) {
      case 'stateExit': {
        console.log(`Leave: "${String(to)}" from "${String(from)}" by "${by}" ${dataString} ${contextString}`.trim());
        break;
      }
      case 'stateTransition': {
        console.log(
          `Transition: from "${String(from)}" to "${String(to)}" by "${by}" ${dataString}  ${contextString}`.trim()
        );
        break;
      }
      case 'stateEnter': {
        console.log(`Enter: "${String(to)}" from "${String(from)}" by "${by}" ${dataString}  ${contextString}`.trim());
        break;
      }
    }
  };
export const log = logTransitionAction();
export const logAction = logTransitionAction({ withData: true });
export const logWithContext = logTransitionAction({ withContext: true });

export const enqueue =
  <
    Transitions extends EventsMap,
    State extends StateMachineState,
    Context extends NonNullable<unknown>,
    StateTo extends StateMachineState,
    Transition extends EventType<Transitions>
  >(
    ...actions: StateMachineTransitionActionEffect<Transitions, State, Context, StateTo, Transition>[]
  ) =>
  (action: StateMachineTransitionAction<Transitions, State, Context, StateTo, Transition>) => {
    actions.forEach((effect) => {
      effect(action);
    });
  };
