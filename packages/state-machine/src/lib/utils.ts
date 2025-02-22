import {
  StateMachineContext,
  StateMachineState,
  StateMachineTransitionAction,
  StateMachineTransitionActionEffect,
} from './types';
import { EventsMap, EventType } from '@powwow-js/emitter';
import { hasSome } from '@powwow-js/nullable';

export const logAction = <
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends StateMachineContext
>(
  action: StateMachineTransitionAction<Transitions, State, Context>
) => {
  const { type, to, from, by, data } = action;
  switch (type) {
    case 'stateExit': {
      console.log(
        `Leave: "${String(to)}" from "${String(from)}" by "${by}" with ${
          hasSome(data) ? JSON.stringify(data) : '<no-data>'
        }"`
      );
      break;
    }
    case 'stateTransition': {
      console.log(
        `Transition: from "${String(from)}" to "${String(to)}" by "${by}" with ${
          hasSome(data) ? JSON.stringify(data) : '<no-data>'
        }"`
      );
      break;
    }
    case 'stateEnter': {
      console.log(
        `Enter: "${String(to)}" from "${String(from)}" by "${by}" with ${
          hasSome(data) ? JSON.stringify(data) : '<no-data>'
        }"`
      );
      break;
    }
  }
};

export const enqueue =
  <
    Transitions extends EventsMap,
    State extends StateMachineState,
    Context extends StateMachineContext,
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
