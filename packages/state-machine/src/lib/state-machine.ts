import type { EventsMap, EventType } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';
import type {
  IStateMachine,
  StateMachineChangeEvents,
  StateMachineDefinition,
  StateMachineState,
  StateMachineTransitionAction,
  StateMachineTransitionActionType,
  StateMachineTransitionResult,
} from './types';
import type { AnyFunction } from '@powwow-js/core';
import { hasProperty, isPlainObject, isSomeFunction, isString, toErrorWithMessage } from '@powwow-js/core';

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

  private processingDepth = 0;

  private processingQueue: {
    transition: EventType<Transitions>;
    parameters: Transitions[EventType<Transitions>] extends undefined ? [] : [Transitions[EventType<Transitions>]];
  }[] = [];

  constructor(definition: StateMachineDefinition<State, Transitions, Context>, context: Context) {
    // TODO AR add ILogger, no console
    // console.error vs console.warn ?

    this.assertsValidDefinition(definition);
    this.definition = definition;
    this.currentState = definition.initialState;
    this.contextData = context;

    this.send = this.send.bind(this);
    this.performTransition = this.performTransition.bind(this);
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
  ): void {
    this.processingQueue.push({ transition, parameters });
    this.processQueue();
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }

  protected processQueue(): void {
    if (this.processingDepth > 0) {
      //  || this.processingQueue.length === 0
      return;
    }

    while (this.processingQueue.length > 0) {
      const transitionItem = this.processingQueue.shift();
      if (transitionItem) {
        this.processingDepth++;
        try {
          const { transition, parameters } = transitionItem;
          this.performTransition(transition, ...parameters);
        } catch (maybeError) {
          this.createFailedTransitionResult(
            `The error occurred on Pending Transitions processing: "${String(this.currentState)}"`,
            toErrorWithMessage(maybeError)
          );
        } finally {
          this.processingDepth--;
        }
      }
    }
  }

  protected performTransition<T extends EventType<Transitions>, D extends Transitions[T]>(
    transition: T,
    ...parameters: D extends undefined ? [] : [D]
  ): StateMachineTransitionResult<State> {
    try {
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

        const nextState =
          destinationTransition && 'target' in destinationTransition ? destinationTransition?.target : undefined;
        return this.commitTransition(previousState, nextState, transition, data);
      }
      return this.commitTransition(previousState, destination.target, transition, data);
    } catch (error) {
      return this.createFailedTransitionResult(
        `Transition error occurred from "${String(this.currentState)}" by "${String(transition)}"`,
        toErrorWithMessage(error)
      );
    }
  }

  protected commitTransition<T extends EventType<Transitions>, D extends Transitions[T]>(
    from: State,
    to: State | undefined,
    by: T,
    data: D
  ): StateMachineTransitionResult<State> {
    const stateDefinition = this.definition.states[from];
    const destinationTransition = stateDefinition?.transitions?.[by];
    const nextState = to ?? this.currentState;
    const newStateDefinition = this.definition.states[nextState];

    if (!newStateDefinition) {
      return this.createFailedTransitionResult(
        `No new state definitions found from "${String(from)}" by "${String(by)}" to "${String(to)}"`
      );
    }

    if (!destinationTransition) {
      return this.createFailedTransitionResult(`No transition(s) found from "${String(from)}" by "${String(by)}"`);
    }

    this.currentState = nextState;

    if (isPlainObject(destinationTransition)) {
      destinationTransition?.action?.(this.createAction('stateTransition', from, nextState, by, data));
    }

    stateDefinition?.actions?.onExit?.(this.createAction('stateExit', from, nextState, by, data));
    newStateDefinition?.actions?.onEnter?.(this.createAction('stateEnter', from, nextState, by, data));

    this.emitter.emit('stateChanged', this.createAction('stateChange', from, nextState, by, data));

    return { type: 'success', success: true, state: this.currentState };
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

  protected createFailedTransitionResult = (message: string, error?: Error): StateMachineTransitionResult<State> => {
    if (error) {
      const errorResult = {
        type: 'error',
        state: this.currentState,
        success: false,
        message,
        error,
      } as const;
      if (this.definition.debug === true) {
        console.error(errorResult);
      }
      return errorResult;
    }

    const warningResult = {
      type: 'warning',
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
