import { EventsMap, EventType } from '@powwow-js/emitter';
import { RecordKey } from '@powwow-js/nullable';

export type StateMachineState = RecordKey;

export interface IStateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>,
  Transition extends EventType<Transitions> = EventType<Transitions>
> {
  get state(): State;
  get context(): Context;
  send<T extends Transition, D extends Transitions[T]>(e: { type: T; data: D }): StateMachineTransitionResult<State>;
  send<T extends Transition>(e: { type: T }): StateMachineTransitionResult<State>;
}

export type StateMachineDefinition<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>,
  Transition extends EventType<Transitions> = EventType<Transitions>
> = {
  initialState: State;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineTransitionActionEffect<Transitions, State, Context, S, Transition>;
        onExit?: StateMachineTransitionActionEffect<Transitions, S, Context, State, Transition>;
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
  isDataOf: <T extends EventType<Transitions>>(data: unknown, transition: T) => data is Transitions[T];
  owner: IStateMachine<State & StateTo, Transitions, Context>;
};

export type StateMachineChangeEvents<
  Transitions extends EventsMap,
  State extends StateMachineState,
  Context extends NonNullable<unknown> = NonNullable<unknown>
> = {
  stateChanged: StateMachineTransitionAction<Transitions, State, Context>;
};
