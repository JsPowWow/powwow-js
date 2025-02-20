import { EventCallback, EventEmitter, EventType } from '@powwow-js/emitter';
import {
  StateMachineChangeEventsDefinition,
  StateMachineContext,
  StateMachineDefinition,
  StateMachineState,
  StateMachineTransition,
} from './types';

export class StateMachine<
  State extends StateMachineState,
  Transition extends StateMachineTransition,
  Context extends StateMachineContext = StateMachineContext,
  ChangeEvent extends StateMachineChangeEventsDefinition<
    State,
    Transition,
    Context
  > = StateMachineChangeEventsDefinition<State, Transition, Context>
> {
  private definition: StateMachineDefinition<State, Transition, Context>;
  private emitter = new EventEmitter<ChangeEvent>();
  private currentState: State;
  private context: Context;

  constructor(definition: StateMachineDefinition<State, Transition, Context>) {
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

  public transition(
    transition: Transition,
    data: unknown = undefined
  ): { state: State } & ({ success: true } | { success: false; message: string }) {
    const currentStateDef = this.definition.states[this.currentState];
    const destinationTransition = currentStateDef?.transitions?.[transition];
    if (!destinationTransition) {
      console.warn();
      return {
        state: this.currentState,
        success: false,
        message: `Invalid transition: from "${String(this.currentState)}" by "${String(transition)}"`,
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

    if (destinationTransition.action) {
      destinationTransition.action.call(this, {
        from: prevState,
        to: newState,
        by: transition,
        context: contextUpdater(this),
      });
    }

    if (currentStateDef?.actions?.onExit) {
      currentStateDef.actions.onExit.call(this, {
        from: prevState,
        to: newState,
        by: transition,
        context: contextUpdater(this),
      });
    }

    if (destinationStateDef?.actions?.onEnter) {
      destinationStateDef.actions.onEnter.call(this, {
        from: prevState,
        to: newState,
        by: transition,
        context: contextUpdater(this),
      });
    }

    this.emitter.emit('stateChanged', { from: prevState, to: newState, by: transition });
    if (contextDidUpdate) {
      contextDidUpdate = false;
      this.emitter.emit('contextChanged', { from: prevState, to: newState, by: transition });
    }

    return { state: this.currentState, success: true };
  }

  public on<Event extends EventType<ChangeEvent>, Callback extends EventCallback<ChangeEvent[Event]>>(
    event: Event,
    cb: Callback
  ): void {
    return this.emitter.on(event, cb);
  }

  public off<Event extends EventType<ChangeEvent>, Callback extends EventCallback<ChangeEvent[Event]>>(
    event: Event,
    cb: Callback
  ): void {
    return this.emitter.off(event, cb);
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
