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

export class StateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Context extends NonNullable<unknown> = NonNullable<unknown>
> implements IStateMachine<State, Transitions, Context>
{
  private definition: StateMachineDefinition<State, Transitions, Context>;
  private emitter = new EventEmitter<StateMachineChangeEvents<State, Transitions, Context>>();

  private currentState: State;
  private readonly contextData: Context;

  constructor(definition: StateMachineDefinition<State, Transitions, Context>, context: Context) {
    if (!definition.initialState) {
      throw new Error('stateMachineDef requires `initialState` to be provided');
    }
    this.definition = definition;
    this.currentState = definition.initialState;
    this.contextData = context;

    this.send = this.send.bind(this);
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
  ): StateMachineTransitionResult<State> {
    const payload = { transition, data: parameters[0] };

    this.assertsValidTransition(payload);

    const data = payload.data;

    const stateDefinition = this.definition.states[this.currentState];
    const destinationTransition = stateDefinition?.transitions?.[transition];

    if (!destinationTransition) {
      const result = {
        state: this.currentState,
        success: false,
        message: `No transition(s) found from "${String(this.currentState)}" by "${String(transition)}"`,
      };
      if (this.definition.debug === true) {
        console.warn(result);
      }
      return result;
    }

    const previousState = this.currentState;
    const newState = destinationTransition.target;
    const newStateDefinition = this.definition.states[newState];

    this.currentState = newState;

    destinationTransition?.action?.(this.createAction('stateTransition', previousState, newState, transition, data));
    stateDefinition?.actions?.onExit?.(this.createAction('stateExit', previousState, newState, transition, data));
    newStateDefinition?.actions?.onEnter?.(this.createAction('stateEnter', previousState, newState, transition, data));

    this.emitter.emit('stateChanged', this.createAction('stateChange', previousState, newState, transition, data));

    return { state: this.currentState, success: true };
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }

  private createAction<
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
      owner: this,
    });
  }

  private assertsValidTransition<T extends EventType<Transitions>, D extends Transitions[T]>(payload: {
    transition: T;
    data: unknown;
  }): asserts payload is { transition: T; data: D } {
    if (!payload.transition) {
      throw new Error('Transition must be provided');
    }
  }
}
