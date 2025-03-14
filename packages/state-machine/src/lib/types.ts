import type { EventsMap, EventType } from '@powwow-js/emitter';
import type { RecordKey } from '@powwow-js/nullable';

export type StateMachineState = RecordKey;

export type IStateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  get state(): State;
  get context(): Context;

  send<T extends EventType<Transitions>, D extends Transitions[T]>(event: {
    type: T;
    data: D;
  }): StateMachineTransitionResult<State>;
};

export type StateMachineDefinition<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  initialState: NoInfer<State>;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineTransitionActionEffect<Transitions, State, Context, S, EventType<Transitions>>;
        onExit?: StateMachineTransitionActionEffect<Transitions, S, Context, State, EventType<Transitions>>;
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
  Context extends NonNullable<unknown>
> = {
  target: StateTo;
  action?: StateMachineTransitionActionEffect<Transitions, StateFrom, Context, StateTo, Transition>;
};

export type StateMachineTransitionResult<State extends StateMachineState> = { state: State } & (
  | { success: true }
  | { success: false; message: string }
);

export type StateMachineTransitionActionEffect<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends NonNullable<unknown>,
  StateTo extends StateMachineState = State,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = (action: StateMachineTransitionAction<Transitions, State, Context, StateTo, Transition>) => void;

export type StateMachineTransitionActionType = 'stateExit' | 'stateEnter' | 'stateTransition';

export type StateMachineTransitionAction<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends NonNullable<unknown>,
  StateTo extends StateMachineState = State,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = {
  type: StateMachineTransitionActionType;
  from: State;
  to: StateTo;
  by: Transition;
  data: Transitions[Transition];
  owner: IStateMachine<State, Transitions, Context>;
};

export type StateMachineChangeEvents<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends NonNullable<unknown> = NonNullable<unknown>
> = {
  stateChanged: StateMachineTransitionAction<Transitions, State, Context>;
};
