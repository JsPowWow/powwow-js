import { EventsMap, EventType } from '@powwow-js/emitter';

export type StateMachineState = string | number | symbol;

export type StateMachineContext = NonNullable<unknown>;

export interface IStateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends StateMachineContext,
  Transition extends EventType<Transitions> = EventType<Transitions>
> {
  get state(): State;

  get context(): Context;
  set context(v: Context);

  send<T extends Transition, D extends Transitions[T]>(e: { type: T; data: D }): StateMachineTransitionResult<State>;
  send<T extends Transition>(e: { type: T }): StateMachineTransitionResult<State>;
}

export type StateMachineDefinition<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends StateMachineContext,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = {
  initialState: State;
  context: Context;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineTransitionAction<Transitions, State, Context, S, Transition>;
        onExit?: StateMachineTransitionAction<Transitions, S, Context, State, Transition>;
      };
      transitions?: {
        [T in EventType<Transitions>]?: StateMachineTransition<Transitions, S, State, T, Context>;
      };
    };
  };
};

export type StateMachineTransition<
  Transitions extends EventsMap,
  StateFrom extends StateMachineState,
  StateTo extends StateMachineState,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext
> = {
  target: StateTo;
  action?: StateMachineTransitionAction<Transitions, StateFrom, Context, StateTo, Transition>;
};

export type StateMachineTransitionResult<State extends StateMachineState> = { state: State } & (
  | { success: true }
  | { success: false; message: string }
);

export type StateMachineTransitionAction<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends StateMachineContext,
  StateTo extends StateMachineState = State,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = (action: StateMachineTransitionActionPayload<Transitions, State, Context, StateTo, Transition>) => void;

export type StateMachineTransitionActionPayload<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends StateMachineContext,
  StateTo extends StateMachineState = State,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = {
  from: State;
  to: StateTo;
  by: Transition;
  data: Transitions[Transition] | undefined;
  isDataOf: <T extends EventType<Transitions>>(data: unknown, transition: T) => data is Transitions[T];
  self: IStateMachine<State & StateTo, Transitions, Context>;
};

export type StateMachineChangeEvents<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends StateMachineContext = StateMachineContext
> = {
  stateChanged: StateMachineTransitionActionPayload<Transitions, State, Context>;
};
