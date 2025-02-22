import { EventEmitter, EventsMap, EventType } from '@powwow-js/emitter';
import {
  IStateMachine,
  StateMachineChangeEvents,
  StateMachineContext,
  StateMachineDefinition,
  StateMachineState,
  StateMachineTransitionActionType,
  StateMachineTransitionResult,
} from './types';

export class StateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext = StateMachineContext
> implements IStateMachine<State, Transitions, Context>
{
  private definition: StateMachineDefinition<State, Transitions, Context>;
  private emitter = new EventEmitter<StateMachineChangeEvents<Transitions, State, Context>>();

  private currentState: State;
  private contextData: Context;

  constructor(definition: StateMachineDefinition<State, Transitions, Context>) {
    if (!definition.initialState) {
      throw new Error('stateMachineDef requires `initialState` to be provided');
    }
    this.definition = definition;
    this.currentState = definition.initialState;
    this.contextData = definition.context;

    this.send = this.send.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  public get state() {
    return this.currentState;
  }

  public set context(ctx: Context) {
    this.contextData = ctx;
  }

  public get context() {
    return this.contextData;
  }

  public send<
    T extends Transition,
    D extends Transitions[T],
    Event extends { type: T; data: D } = { type: T; data: D }
  >(
    event: Event extends { type: T; data: undefined } ? { type: T; data?: D } : Event
  ): StateMachineTransitionResult<State> {
    const currentStateDef = this.definition.states[this.currentState];
    const destinationTransition = currentStateDef?.transitions?.[event.type];

    if (!destinationTransition) {
      return {
        state: this.currentState,
        success: false,
        message: `Invalid transition: from "${String(this.currentState)}" by "${String(event.type)}"`,
      };
    }

    const prevState = this.currentState;
    const newState = destinationTransition.target;

    this.currentState = newState;

    const actionPayload = <T extends StateMachineTransitionActionType>(actionType: T) =>
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
