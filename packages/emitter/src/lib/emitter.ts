import type { EventType, EventsMap, EventCallback, IEventEmitter, EventData } from './types';
import { isSomeFunction } from '@powwow-js/nullable';

export class EventEmitter<Events extends EventsMap> implements IEventEmitter<Events> {
  private listeners: {
    [Event in keyof EventsMap]?: ((p: EventsMap[Event]) => void)[];
  } = {};

  public on = <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    callback: Callback
  ): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    if (typeof event === 'string' && isSomeFunction<(p: EventsMap[Event]) => void>(callback)) {
      this.listeners[event].push(callback);
    }
  };

  public off = <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    callback: Callback
  ): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((f) => f !== callback);
  };

  public emit = <Event extends EventType<Events>, Data extends EventData<Events, Event>>(
    event: Event,
    data: Data
  ): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((callback) => {
      callback(data);
    });
  };

  public hasListener = <Event extends EventType<Events>>(event: Event): boolean => {
    return Boolean(this.listeners[event]);
  };

  public destroy = (): void => {
    this.listeners = {};
  };
}
