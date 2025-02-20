import { EventType, EventsDefinition, EventCallback, IEventEmitter } from './types';

export class EventEmitter<Events extends EventsDefinition> implements IEventEmitter<Events> {
  private listeners: {
    [Event in keyof EventsDefinition]?: CallableFunction[];
  } = {};

  public on = <Event extends EventType<Events>, Callback extends EventCallback<Events[Event]>>(
    event: Event,
    callback: Callback
  ): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  };

  public off = <Event extends EventType<Events>, Callback extends EventCallback<Events[Event]>>(
    event: Event,
    callback: Callback
  ): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((f) => f !== callback);
  };

  public emit = <Event extends EventType<Events>, Data extends Events[Event]>(event: Event, data: Data): void => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((fn) => {
      fn(data);
    });
  };

  public hasListener = <Event extends EventType<Events>>(event: Event): boolean => {
    return Boolean(this.listeners[event]);
  };

  public destroy = (): void => {
    this.listeners = {};
  };
}
