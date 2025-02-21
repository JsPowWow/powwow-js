import { EventsMap, EventType } from '@powwow-js/emitter';

export type StateMachineState = string | number | symbol;

export type StateMachineContext = Record<string | number | symbol, unknown>;

export type StateMachineTransition<
  Transitions extends EventsMap,
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext
> = {
  target: StateTo;
  action?: StateMachineTransitionAction<Transitions, StateFrom, StateTo, Transition, Context>;
};

export type StateMachineTransitionResult<State extends StateMachineState> = { state: State } & (
  | { success: true }
  | { success: false; message: string }
);

export type StateMachineTransitionAction<
  Transitions extends EventsMap,
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext
> = (action: StateMachineTransitionActionPayload<Transitions, StateFrom, StateTo, Transition, Context>) => void;

export type StateMachineTransitionActionPayload<
  Transitions extends EventsMap,
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext
> = {
  from: StateFrom;
  to: StateTo;
  by: Transition;
  data: Transitions[Transition] | undefined;
  isDataOf: <T extends EventType<Transitions>>(data: unknown, transition: T) => data is Transitions[T];
  ctx: {
    get: () => Context;
    set: (
      data: Partial<Context>
    ) => StateMachineTransitionActionPayload<Transitions, StateFrom, StateTo, Transition, Context>['ctx'];
  };
};

export type StateMachineDefinition<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends StateMachineContext = StateMachineContext,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = {
  initialState: State;
  context?: Context;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineTransitionAction<Transitions, State, S, Transition, Context>;
        onExit?: StateMachineTransitionAction<Transitions, S, State, Transition, Context>;
      };
      transitions?: {
        [T in EventType<Transitions>]?: StateMachineTransition<Transitions, S, State, T, Context>;
      };
    };
  };
};

export type StateMachineChangeEvents<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends StateMachineContext = StateMachineContext
> = {
  stateChanged: Pick<
    StateMachineTransitionActionPayload<Transitions, State, State, EventType<Transitions>, Context>,
    'from' | 'to' | 'by' | 'data' | 'isDataOf'
  >;
  contextChanged: Pick<
    StateMachineTransitionActionPayload<Transitions, State, State, EventType<Transitions>, Context>,
    'from' | 'to' | 'by' | 'data' | 'isDataOf'
  >;
};
