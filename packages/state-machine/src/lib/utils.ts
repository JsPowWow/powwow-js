import type { StateMachineState, StateMachineTransitionAction, StateMachineTransitionActionEffect } from './types';
import type { EventsMap, EventType } from '@powwow-js/emitter';
import { hasSome, isSomeFunction } from '@powwow-js/nullable';

export const logTransitionAction =
  (options?: { withContext?: boolean; withData?: boolean }) =>
  <State extends StateMachineState, Transitions extends EventsMap, Context extends NonNullable<unknown>>(
    action: StateMachineTransitionAction<Transitions, State, Context>
  ): void => {
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
  when: <T extends EventType<Transitions>>(
    pattern: { by: T },
    f: StateMachineTransitionActionEffect<Transitions, State, Context, State, T>
  ) => MatchActionHelper<State, Transitions, Context>;
};

export const matchAction = <
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
>(
  action: StateMachineTransitionAction<Transitions, State, Context, State>
): MatchActionHelper<State, Transitions, Context> => {
  const matcher: MatchActionHelper<State, Transitions, Context> = {
    when: function ({ by }, f): typeof this {
      if (
        hasSome<StateMachineTransitionAction<Transitions, State, Context, State, typeof by>>(action) &&
        action.by === by
      ) {
        f(action);
      }
      return this;
    },
  };

  matcher.when = matcher.when.bind(matcher);
  return matcher;
};

type ActionEffectRunner<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
> = {
  when: <T extends EventType<Transitions>>(
    pattern: { by: T },
    f: StateMachineTransitionActionEffect<Transitions, State, Context, State, T>
  ) => ActionEffectRunner<State, Transitions, Context>;
  invokeAction: (a: StateMachineTransitionAction<Transitions, State, Context, State>) => void;
};

export const runActionEffect = <
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown>
>(): ActionEffectRunner<State, Transitions, Context> => {
  const listeners = new Map<EventType<Transitions>, CallableFunction>();

  const runner: ActionEffectRunner<State, Transitions, Context> = {
    when: function ({ by }, f): typeof this {
      listeners.set(by, f);
      return this;
    },
    invokeAction: function (action: StateMachineTransitionAction<Transitions, State, Context, State>): void {
      listeners.forEach((listener, transition) => {
        if (isSomeFunction(listener) && action.by === transition) {
          listener(action);
        }
      });
    },
  };

  runner.when = runner.when.bind(runner);
  runner.invokeAction = runner.invokeAction.bind(runner);
  return runner;
};
