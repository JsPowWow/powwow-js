import { EventsDefinition, EventType } from '@powwow-js/emitter';

export type StateMachineState = string | number | symbol;

export type StateMachineContext = Record<string | number | symbol, unknown>;

export type StateMachineAction<
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  TransitionEvent extends EventsDefinition,
  Context,
  Transition extends EventType<TransitionEvent> = EventType<TransitionEvent>,
  Data extends TransitionEvent[Transition] = TransitionEvent[Transition]
> = {
  from: StateFrom;
  to: StateTo;
  by: { type: Transition; data?: Data };
  context: {
    get: () => Context;
    set: (data: Partial<Context>) => StateMachineAction<StateFrom, StateTo, TransitionEvent, Context>['context'];
  };
};

export type StateMachineActionCallback<
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  TransitionEvent extends EventsDefinition,
  Context
> = (action: StateMachineAction<StateFrom, StateTo, TransitionEvent, Context>) => void;

export type StateMachineDefinition<
  State extends StateMachineState,
  TransitionEvent extends EventsDefinition,
  Context extends StateMachineContext = StateMachineContext
> = {
  initialState: State;
  context?: Context;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineActionCallback<State, S, TransitionEvent, Context>;
        onExit?: StateMachineActionCallback<S, State, TransitionEvent, Context>;
      };
      transitions?: {
        [T in EventType<TransitionEvent>]?: {
          target: State;
          action?: StateMachineActionCallback<S, State, TransitionEvent, Context>;
        };
      };
    };
  };
};

export type StateMachineChangeEventsDefinition<
  State extends StateMachineState,
  TransitionEvent extends EventsDefinition,
  Context
> = {
  stateChanged: Omit<StateMachineAction<State, State, TransitionEvent, Context>, 'context'>;
  contextChanged: Omit<StateMachineAction<State, State, TransitionEvent, Context>, 'context'>;
};
