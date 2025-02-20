export type StateMachineState = string | number | symbol;

export type StateMachineTransition = string | number | symbol;

export type StateMachineContext = Record<string | number | symbol, unknown>;

export type StateMachineAction<StateFrom, StateTo, Transition, Context> = {
  from: StateFrom;
  to: StateTo;
  by: Transition;
  context: {
    get: () => Context;
    set: (data: Partial<Context>) => StateMachineAction<StateFrom, StateTo, Transition, Context>['context'];
  };
};

export type StateMachineActionCallback<StateFrom, StateTo, Transition, Context> = (
  action: StateMachineAction<StateFrom, StateTo, Transition, Context>
) => void;

export type StateMachineDefinition<
  State extends StateMachineState,
  Transition extends StateMachineTransition,
  Context extends StateMachineContext = StateMachineContext
> = {
  initialState: State;
  context?: Context;
  states: {
    [S in State]: {
      actions?: {
        onEnter?: StateMachineActionCallback<State, S, Transition, Context>;
        onExit?: StateMachineActionCallback<S, State, Transition, Context>;
      };
      transitions?: {
        [T in Transition]?: {
          target: State;
          action?: StateMachineActionCallback<S, State, Transition, Context>;
        };
      };
    };
  };
};

export type StateMachineChangeEventsDefinition<
  State extends StateMachineState,
  Transition extends StateMachineTransition,
  Context
> = {
  stateChanged: Omit<StateMachineAction<State, State, Transition, Context>, 'context'>;
  contextChanged: Omit<StateMachineAction<State, State, Transition, Context>, 'context'>;
};
