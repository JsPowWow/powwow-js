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

  public send<T extends EventType<Transitions>, D extends Transitions[T]>(event: {
    type: T;
    data: D;
  }): StateMachineTransitionResult<State> {
    const currentStateDefinition = this.definition.states[this.currentState];

    const destinationTransition = currentStateDefinition?.transitions?.[event.type];

    if (!destinationTransition) {
      return {
        state: this.currentState,
        success: false,
        message: `No transition(s) from "${String(this.currentState)}" by "${String(event.type)}"`,
      };
    }

    const previousState = this.currentState;

    const newState = destinationTransition.target;

    this.currentState = newState;

    if (destinationTransition.action) {
      destinationTransition.action.call(
        this,
        this.actionPayload('stateTransition', previousState, newState, event.type, event.data)
      );
    }

    if (currentStateDefinition?.actions?.onExit) {
      currentStateDefinition.actions.onExit.call(
        this,
        this.actionPayload('stateExit', previousState, newState, event.type, event.data)
      );
    }

    const destinationStateDefinition = this.definition.states[newState];

    if (destinationStateDefinition?.actions?.onEnter) {
      destinationStateDefinition.actions.onEnter.call(
        this,
        this.actionPayload('stateEnter', previousState, newState, event.type, event.data)
      );
    }

    this.emitter.emit(
      'stateChanged',
      this.actionPayload('stateEnter', previousState, newState, event.type, event.data)
    );

    return { state: this.currentState, success: true };
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }

  private actionPayload<
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
}
