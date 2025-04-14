import type { StateMachineState, StateMachineTransitionAction, StateMachineTransitionActionEffect } from './types';
import type { EventsMap, EventType } from '@powwow-js/emitter';
import { hasSome, isSomeFunction } from '@powwow-js/core';

// TODO AR split utils per files

export const logTransitionAction =
  (options?: { withContext?: boolean; withData?: boolean }) =>
  <State extends StateMachineState, Transitions extends EventsMap, Context extends NonNullable<unknown>>(
    action: StateMachineTransitionAction<Transitions, State, Context>
  ): void => {
    const { type, to, from, by, data, context } = action;
    const dataString = options?.withData === true ? `${hasSome(data) ? JSON.stringify(data) : '<no-data>'}` : '';
    const contextString = options?.withContext === true ? `with  ${JSON.stringify(context)}` : '';

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
    State extends StateMachineState,
    Transitions extends EventsMap,
    Context extends NonNullable<unknown>,
    StateTo extends StateMachineState,
    Transition extends EventType<Transitions>
  >(
    ...actions: StateMachineTransitionActionEffect<Transitions, State, Context, StateTo, Transition>[]
  ) =>
  (action: StateMachineTransitionAction<Transitions, State, Context, StateTo, Transition>): void => {
    actions.forEach((effect) => {
      effect(action);
    });
  };

type MatchActionHelper<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  when: <T extends EventType<Transitions>, S extends State>(
    pattern: { by?: T; to?: S },
    f: StateMachineTransitionActionEffect<Transitions, S, Context, S, T>
  ) => MatchActionHelper<State, Transitions, Context>;
};

export function matchAction<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
>(
  action: StateMachineTransitionAction<Transitions, State, Context, State>
): MatchActionHelper<State, Transitions, Context> {
  const matcher: MatchActionHelper<State, Transitions, Context> = {
    when: function (pattern, f): typeof this {
      const hasBy = 'by' in pattern;
      const matchedWithBy = hasBy && hasSome(action) && action.by === pattern.by;
      const hasStateTo = 'to' in pattern;
      const matchedWithTo = hasStateTo && hasSome(action) && action.to === pattern.to;

      if (
        hasSome<
          StateMachineTransitionAction<
            Transitions,
            NonNullable<typeof pattern.to>,
            Context,
            NonNullable<typeof pattern.to>,
            NonNullable<typeof pattern.by>
          >
        >(action) &&
        (!hasBy || matchedWithBy) &&
        (!hasStateTo || matchedWithTo)
      ) {
        f(action);
      }
      return this;
    },
  };

  matcher.when = matcher.when.bind(matcher);
  return matcher;
}

type ActionEffectRunner<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  when: <T extends EventType<Transitions>, S extends State>(
    pattern: { by?: T; to?: S },
    f: StateMachineTransitionActionEffect<Transitions, State, Context, State, T>
  ) => ActionEffectRunner<State, Transitions, Context>;
  invokeAction: (a: StateMachineTransitionAction<Transitions, State, Context, State>) => void;
};

export const runActionEffect = <
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
>(): ActionEffectRunner<State, Transitions, Context> => {
  const listeners = new Map<{ by?: EventType<Transitions>; to?: State }, CallableFunction>();

  const runner: ActionEffectRunner<State, Transitions, Context> = {
    when: function (pattern, f): typeof this {
      listeners.set(pattern, f);
      return this;
    },
    invokeAction: function (action: StateMachineTransitionAction<Transitions, State, Context, State>): void {
      listeners.forEach((listener, pattern) => {
        if (isSomeFunction(listener)) {
          const hasBy = 'by' in pattern;
          const matchedWithBy = hasBy && hasSome(action) && action.by === pattern.by;
          const hasStateTo = 'to' in pattern;
          const matchedWithTo = hasStateTo && hasSome(action) && action.to === pattern.to;
          if (
            hasSome<
              StateMachineTransitionAction<
                Transitions,
                NonNullable<typeof pattern.to>,
                Context,
                NonNullable<typeof pattern.to>,
                NonNullable<typeof pattern.by>
              >
            >(action) &&
            (!hasBy || matchedWithBy) &&
            (!hasStateTo || matchedWithTo)
          ) {
            listener(action);
          }
        }
      });
    },
  };

  runner.when = runner.when.bind(runner);
  runner.invokeAction = runner.invokeAction.bind(runner);
  return runner;
};
