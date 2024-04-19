export type EventMap = Record<string, unknown>;
export type EventMapKey<Events extends EventMap> = string & keyof Events;
export type EventListenerCallback<Event> = (event: Event) => void;

export interface IEventEmitter<Events extends EventMap> {
  on: <Event extends EventMapKey<Events>>(
    eventName: Event,
    fn: EventListenerCallback<Events[Event]>
  ) => void;
  off: <Event extends EventMapKey<Events>>(
    eventName: Event,
    fn: EventListenerCallback<Events[Event]>
  ) => void;
  emit: <Event extends EventMapKey<Events>>(
    eventName: Event,
    params: Events[Event]
  ) => void;
}
