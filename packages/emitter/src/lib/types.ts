export type EventsMap = Record<string, unknown>;
export type EventType<Events extends EventsMap> = string & keyof Events;
export type EventData<Events extends EventsMap, Event extends EventType<Events>> = Events[Event];
export type EventCallback<Data> = (data: Data) => void;

export interface IEventEmitter<Events extends EventsMap> {
  on: <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    cb: Callback
  ) => void;
  off: <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    cb: Callback
  ) => void;
  emit: <Event extends EventType<Events>, Params extends EventData<Events, Event>>(
    event: Event,
    params: Params
  ) => void;
}
