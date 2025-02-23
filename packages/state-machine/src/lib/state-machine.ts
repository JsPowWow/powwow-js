import { EventEmitter, EventsMap, EventType } from '@powwow-js/emitter';
import {
  IStateMachine,
  StateMachineChangeEvents,
  StateMachineDefinition,
  StateMachineState,
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
  private emitter = new EventEmitter<StateMachineChangeEvents<Transitions, State, Context>>();

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

  public get state() {
    return this.currentState;
  }

  public get context() {
    return this.contextData;
  }

  public transition<T extends EventType<Transitions>, D extends Transitions[T], Args extends [T, D]>(
    ...args: Args extends [T, undefined] ? [T] : Args
  ): StateMachineTransitionResult<State> {
    return this.send({ type: args[0], data: <D>(args[1] ? args[1] : undefined) });
  }

  public send<T extends EventType<Transitions>, D extends Transitions[T]>(event: {
    type: T;
    data: D;
  }): StateMachineTransitionResult<State> {
    const currentStateDef = this.definition.states[this.currentState];
    const destinationTransition = currentStateDef?.transitions?.[event.type];

    if (!destinationTransition) {
      return {
        state: this.currentState,
        success: false,
        message: `No transition(s) from "${String(this.currentState)}" by "${String(event.type)}"`,
      };
    }

    const prevState = this.currentState;
    const newState = destinationTransition.target;

    this.currentState = newState;

    const actionPayload = <A extends StateMachineTransitionActionType>(actionType: A) =>
      Object.freeze({
        type: actionType,
        from: prevState,
        to: newState,
        by: event.type,
        data: event.data,
        isDataOf: <T extends EventType<Transitions>>(data: unknown, transition: T): data is Transitions[T] =>
          Object.is(transition, event.type),
        owner: this,
      });

    if (destinationTransition.action) {
      destinationTransition.action.call(this, actionPayload('stateTransition'));
    }

    if (currentStateDef?.actions?.onExit) {
      currentStateDef.actions.onExit.call(this, actionPayload('stateExit'));
    }

    const destinationStateDef = this.definition.states[newState];
    if (destinationStateDef?.actions?.onEnter) {
      destinationStateDef.actions.onEnter.call(this, actionPayload('stateEnter'));
    }

    this.emitter.emit('stateChanged', actionPayload('stateEnter'));

    return { state: this.currentState, success: true };
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...params: P): void {
    return this.emitter.on.apply(this, params);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...params: P): void {
    return this.emitter.off.apply(this, params);
  }
}
