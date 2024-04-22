export type EventMap = Record<string, unknown>;
export type EventMapKey<Map extends EventMap> = string & keyof Map;
export type EventCallback<Event> = (event: Event) => void;

export interface IEventEmitter<Events extends EventMap> {
  on: <Event extends EventMapKey<Events>>(
    eventName: Event,
    fn: EventCallback<Events[Event]>
  ) => void;
  off: <Event extends EventMapKey<Events>>(
    eventName: Event,
    fn: EventCallback<Events[Event]>
  ) => void;
  emit: <Event extends EventMapKey<Events>>(
    eventName: Event,
    params: Events[Event]
  ) => void;
}
