import type { EventsCallback } from './types';

export class EventsListeners {
  private listeners = new Map<string, Set<EventsCallback>>();

  public add(event: string, callback: EventsCallback): void {
    let eventListeners = this.listeners.get(event);

    if (eventListeners) {
      eventListeners.add(callback);
    } else {
      eventListeners = new Set([callback]);
      this.listeners.set(event, eventListeners);
    }
  }

  public remove(event: string, callback: EventsCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  public removeAll = (): void => {
    this.listeners = new Map();
  };

  public hasListener(event: string): boolean {
    const eventListenersSet = this.listeners.get(event);
    return eventListenersSet ? eventListenersSet.size > 0 : false;
  }

  public invoke<Data>(event: string, data: Data): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(data);
      });
    }
  }
}
