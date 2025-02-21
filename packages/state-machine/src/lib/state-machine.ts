import { EventEmitter, EventsMap, EventType } from '@powwow-js/emitter';
import {
  StateMachineChangeEvents,
  StateMachineContext,
  StateMachineDefinition,
  StateMachineState,
  StateMachineTransitionResult,
} from './types';

export class StateMachine<
  State extends StateMachineState,
  Transitions extends EventsMap,
  Transition extends EventType<Transitions>,
  Context extends StateMachineContext = StateMachineContext
> {
  private definition: StateMachineDefinition<State, Transitions, Context>;
  private emitter = new EventEmitter<StateMachineChangeEvents<State, Transitions, Context>>();

  private currentState: State;
  private context: Context;

  constructor(definition: StateMachineDefinition<State, Transitions, Context>) {
    if (!definition.initialState) {
      throw new Error('stateMachineDef requires `initialState` to be provided');
    }
    this.definition = definition;
    this.currentState = definition.initialState;
    this.context = definition.context ?? ({} as Context);
  }

  public get state() {
    return this.currentState;
  }

  public getContext() {
    return { ...this.context };
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
    const destinationStateDef = this.definition.states[newState];
    this.currentState = newState;

    let contextDidUpdate = false;

    const contextUpdater = (machine: typeof this) => ({
      get: function () {
        return { ...machine.context };
      },
      set: function (ctxData: Partial<Context>): typeof this {
        machine.context = { ...machine.context, ...ctxData };
        contextDidUpdate = true;
        return this;
      },
    });

    const actionPayload = () => {
      return {
        from: prevState,
        to: newState,
        by: event.type,
        data: event.data,
        isDataOf: <T extends EventType<Transitions>>(data: unknown, transition: T): data is Transitions[T] =>
          Object.is(transition, event.type),
      };
    };

    if (destinationTransition.action) {
      destinationTransition.action.call(this, { ...actionPayload(), ...{ ctx: contextUpdater(this) } });
    }

    if (currentStateDef?.actions?.onExit) {
      currentStateDef.actions.onExit.call(this, { ...actionPayload(), ...{ ctx: contextUpdater(this) } });
    }

    if (destinationStateDef?.actions?.onEnter) {
      destinationStateDef.actions.onEnter.call(this, { ...actionPayload(), ...{ ctx: contextUpdater(this) } });
    }

    this.emitter.emit('stateChanged', actionPayload());
    if (contextDidUpdate) {
      contextDidUpdate = false;
      this.emitter.emit('contextChanged', actionPayload());
    }

    return { state: this.currentState, success: true };
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...params: P): void {
    return this.emitter.on.apply(this, params);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...params: P): void {
    return this.emitter.off.apply(this, params);
  }
}

// export function createStateMachine(stateMachineDef) {
//   if (!stateMachineDef.initialState) {
//     throw new Error('stateMachineDef requires `initialState` to be provided');
//   }
//
//   const machine = {
//     currentState: stateMachineDef.initialState,
//     context: stateMachineDef.context ?? {},
//
//     subscribe(eventName, cb) {
//       return emitter.on(eventName, cb);
//     },
//     unsubscribe(eventName, cb) {
//       return emitter.off(eventName, cb);
//     },
//
//     transition(event, eventData = undefined) {
//       /** @type {StateDef} */
//       const currentStateDef = stateMachineDef[this.currentState];
//       const destinationTransition = currentStateDef.transitions[event];
//
//       if (!destinationTransition) {
//         console.error(`Invalid transition: from "${this.currentState}" by "${event}"`);
//         return this.currentState;
//       }
//
//       const previousState = this.currentState;
//       const newState = destinationTransition.target;
//       /** @type {StateDef} */
//       const destinationStateDef = stateMachineDef[newState];
//
//       this.currentState = newState;
//       let contextDidUpdate = false;
//
//       /** @return {StateChangePayload} */
//       const stateChangePayload = () => ({
//         prevState: previousState,
//         state: this.currentState,
//         data: eventData,
//         trigger: event,
//         context: {
//           getContext: this.getContext,
//           /** @param {object} data */
//           updateContext: (data) => {
//             this.context = { ...this.context, ...data };
//             contextDidUpdate = true;
//           },
//         },
//       });
//
//       if (destinationTransition.action) {
//         destinationTransition.action.call(this, stateChangePayload());
//       }
//
//       if (currentStateDef.actions.onExit) {
//         currentStateDef.actions.onExit.call(this, stateChangePayload());
//       }
//       if (destinationStateDef.actions.onEnter) {
//         destinationStateDef.actions.onEnter.call(this, stateChangePayload());
//       }
//
//       emitter.dispatch('stateChanged', stateChangePayload());
//       if (contextDidUpdate) {
//         contextDidUpdate = false;
//         emitter.dispatch('contextChanged', this.getContext());
//       }
//
//       return this.currentState;
//     },
//
//     get state() {
//       return this.currentState;
//     },
//
//     getContext() {
//       return { ...this.context };
//     },
//   };
//
//   machine.getContext = machine.getContext.bind(machine);
//   machine.transition = machine.transition.bind(machine);
//   machine.subscribe = machine.subscribe.bind(machine);
//   machine.unsubscribe = machine.unsubscribe.bind(machine);
//
//   return machine;
// }
