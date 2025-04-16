import type { EventsMap, EventType } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';
import type {
  IStateMachine,
  StateMachineChangeEvents,
  StateMachineDefinition,
  StateMachinePendingTransition,
  StateMachineState,
  StateMachineTransitionAction,
  StateMachineTransitionActionType,
  StateMachineTransitionResult,
} from './types';
import type { AnyFunction } from '@powwow-js/core';
import {
  hasProperty,
  isPlainObject,
  isPromise,
  isSomeFunction,
  isString,
  promiseResolver,
  toErrorWithMessage,
} from '@powwow-js/core';
import Queue from './Queue';

export class StateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown> = NonNullable<unknown>
> implements IStateMachine<State, Transitions, Context>
{
  private currentState: State;

  private definition: StateMachineDefinition<State, Transitions, Context>;

  private emitter = new EventEmitter<StateMachineChangeEvents<State, Transitions, Context>>();

  private readonly contextData: Context;

  private readonly processingQueue = new Queue<StateMachinePendingTransition<Transitions, State, Context>>().process(
    (task): Promise<StateMachineTransitionResult<Transitions, State, Context>> => {
      try {
        const result = this.processTransitionTask(task);
        if (isPromise(result)) {
          result.then(task.resolver.resolve).catch((anyError) => {
            task.resolver.resolve(
              this.createFailedTransitionResult(
                `The error occurred on "${String(this.currentState)}" pending transition processing.`,
                toErrorWithMessage(anyError)
              )
            );
          });
        } else {
          task.resolver.resolve(result);
        }
      } catch (anyError) {
        task.resolver.resolve(
          this.createFailedTransitionResult(
            `The error occurred on "${String(this.currentState)}" transition processing.`,
            toErrorWithMessage(anyError)
          )
        );
      }
      return task.resolver.promise;
    }
  );

  constructor(definition: StateMachineDefinition<State, Transitions, Context>, context: Context) {
    // TODO AR add ILogger, no console
    // console.error vs console.warn ?

    this.assertsValidDefinition(definition);
    this.definition = definition;
    this.currentState = definition.initialState;
    this.contextData = context;

    this.send = this.send.bind(this);
    this.processTransitionTask = this.processTransitionTask.bind(this);
    this.commitTransition = this.commitTransition.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  public get state(): State {
    return this.currentState;
  }

  public get context(): Context {
    return this.contextData;
  }

  public send<T extends EventType<Transitions>, D extends Transitions[T]>(
    transition: T,
    ...parameters: D extends undefined ? [] : [D]
  ): Promise<StateMachineTransitionResult<Transitions, State, Context>> {
    const resolver = promiseResolver<StateMachineTransitionResult<Transitions, State, Context>>();

    this.processingQueue.add({
      status: 'pending',
      success: false,
      state: this.currentState,
      transition,
      parameters,
      resolver,
    });

    return resolver.promise;
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }

  // eslint-disable-next-line max-lines-per-function
  protected processTransitionTask(
    transitionTask: StateMachinePendingTransition<Transitions, State, Context>
  ):
    | StateMachineTransitionResult<Transitions, State, Context>
    | Promise<StateMachineTransitionResult<Transitions, State, Context>> {
    try {
      const { transition, parameters } = transitionTask;
      const payload = { transition, data: parameters[0] };

      this.assertsValidTransition(payload);

      const data = payload.data;

      const stateDefinition = this.definition.states[this.currentState];
      const destination = stateDefinition?.transitions?.[transition];
      const previousState = this.currentState;

      if (!destination) {
        return this.createFailedTransitionResult(
          `No transition(s) found from "${String(this.currentState)}" by "${String(transition)}"`
        );
      }

      if (isSomeFunction<AnyFunction>(destination)) {
        const destinationTransition = destination({
          from: previousState,
          by: transition,
          data,
          context: this.context,
          owner: this,
        });

        if (isPromise(destinationTransition)) {
          return destinationTransition.then(
            (result) => {
              return this.commitTransition(previousState, result?.['target'] ?? this.currentState, transition, data);
            },
            (error) => {
              return this.createFailedTransitionResult(
                `Pending Transition error occurred from "${String(this.currentState)}" by "${String(
                  transitionTask.transition
                )}"`,
                toErrorWithMessage(error)
              );
            }
          );
        }

        const nextState =
          (destinationTransition && 'target' in destinationTransition ? destinationTransition?.target : undefined) ??
          this.currentState;

        return this.commitTransition(previousState, nextState, transition, data);
      }

      return this.commitTransition(previousState, destination.target, transition, data);
    } catch (error) {
      return this.createFailedTransitionResult(
        `Transition error occurred from "${String(this.currentState)}" by "${String(transitionTask.transition)}"`,
        toErrorWithMessage(error)
      );
    }
  }

  protected commitTransition<T extends EventType<Transitions>, D extends Transitions[T]>(
    from: State,
    to: State,
    by: T,
    data: D
  ): StateMachineTransitionResult<Transitions, State, Context> {
    const stateDefinition = this.definition.states[from];
    const destinationTransition = stateDefinition?.transitions?.[by];

    const newStateDefinition = this.definition.states[to];

    if (!newStateDefinition) {
      return this.createFailedTransitionResult(
        `No new state definitions found from "${String(from)}" by "${String(by)}" to "${String(to)}"`
      );
    }

    if (!destinationTransition) {
      return this.createFailedTransitionResult(
        `No transition(s) found from "${String(from)}" to "${String(to)}" by "${String(by)}"`
      );
    }

    this.currentState = to;

    if (isPlainObject(destinationTransition)) {
      destinationTransition?.action?.(this.createAction('stateTransition', from, to, by, data));
    }

    stateDefinition?.actions?.onExit?.(this.createAction('stateExit', from, to, by, data));
    newStateDefinition?.actions?.onEnter?.(this.createAction('stateEnter', from, to, by, data));

    const successAction = this.createAction('stateChange', from, to, by, data);
    this.emitter.emit('stateChanged', successAction);

    return { status: 'success', success: true, state: this.currentState, action: successAction };
  }

  protected createAction<
    A extends StateMachineTransitionActionType,
    T extends EventType<Transitions>,
    D extends Transitions[T]
  >(
    actionType: A,
    from: State,
    to: State,
    by: T,
    data: D
  ): StateMachineTransitionAction<Transitions, State, Context, State, T> {
    return Object.freeze({
      type: actionType,
      from,
      to,
      by,
      data,
      context: this.context,
      owner: this,
    });
  }

  protected createFailedTransitionResult = (
    message: string,
    error?: Error
  ): StateMachineTransitionResult<Transitions, State, Context> => {
    if (error) {
      const errorResult = {
        status: 'error',
        state: this.currentState,
        success: false,
        message: error.message,
        error,
        details: message,
      } as const;
      if (this.definition.debug === true) {
        console.warn(errorResult);
      }
      return errorResult;
    }

    const warningResult = {
      status: 'warning',
      state: this.currentState,
      success: false,
      message,
    } as const;

    if (this.definition.debug === true) {
      console.warn(warningResult);
    }
    return warningResult;
  };

  protected assertsValidTransition<T extends EventType<Transitions>, D extends Transitions[T]>(payload: {
    transition: T;
    data: unknown;
  }): asserts payload is { transition: T; data: D } {
    if (!payload.transition) {
      throw new Error('Transition must be provided');
    }
  }

  protected assertsValidDefinition<D = StateMachineDefinition<State, Transitions, Context>>(
    definition: unknown
  ): asserts definition is D {
    if (!definition || !hasProperty('initialState', definition) || !isString(definition['initialState'])) {
      throw new Error('stateMachineDef requires `initialState` to be provided');
    }
  }
}

export function createStateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown> = NonNullable<unknown>
>(
  definition: StateMachineDefinition<State, Transitions, Context>,
  context: Context
): IStateMachine<State, Transitions, Context> {
  return new StateMachine(definition, context);
}
