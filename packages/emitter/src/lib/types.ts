export type EventsDefinition = Record<string, unknown>;
export type EventType<Definition extends EventsDefinition> = string & keyof Definition;
export type EventCallback<Event> = (event: Event) => void;

export interface IEventEmitter<Events extends EventsDefinition> {
  on: <Event extends EventType<Events>, Callback extends EventCallback<Events[Event]>>(
    event: Event,
    cb: Callback
  ) => void;
  off: <Event extends EventType<Events>, Callback extends EventCallback<Events[Event]>>(
    event: Event,
    cb: Callback
  ) => void;
  emit: <Event extends EventType<Events>, Params extends Events[Event]>(event: Event, params: Params) => void;
}
