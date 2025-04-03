import type { EventsMap, EventType } from '@powwow-js/emitter';
import type { KeysWithType, RecordKey } from '@powwow-js/core';

export type StateMachineState = RecordKey;

export interface IStateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> {
  get state(): State;
  get context(): Context;

  send<T extends KeysWithType<Transitions, undefined>>(event: T): StateMachineTransitionResult<State>;
  send<T extends EventType<Transitions>, D extends Transitions[T]>(
    event: T,
    data: D
  ): StateMachineTransitionResult<State>;
}

export type StateMachineDefinition<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  initialState: NoInfer<State>;
  debug?: boolean;
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

export type StateMachineTransitionActionType = 'stateTransition' | 'stateExit' | 'stateEnter' | 'stateChange';

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
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown> = NonNullable<unknown>
> = {
  stateChanged: StateMachineTransitionAction<Transitions, State, Context>;
};
