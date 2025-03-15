import type { EventCallback, EventsCallback, EventData, EventsMap, EventType, IEventEmitter } from './types';
import { isSomeFunction } from '@powwow-js/nullable';
import { EventsListeners } from './events-listeners';

export class EventEmitter<Events extends EventsMap> implements IEventEmitter<Events> {
  private listeners = new EventsListeners();

  public on = <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    callback: Callback
  ): void => {
    if (isSomeFunction<EventsCallback>(callback)) {
      this.listeners.add(event, callback);
    }
  };

  public off = <Event extends EventType<Events>, Callback extends EventCallback<EventData<Events, Event>>>(
    event: Event,
    callback: Callback
  ): void => {
    if (isSomeFunction<EventsCallback>(callback)) {
      this.listeners.remove(event, callback);
    }
  };

  public emit = <Event extends EventType<Events>, Data extends EventData<Events, Event>>(
    event: Event,
    data: Data
  ): void => this.listeners.invoke(event, data);

  public emitEvent = <Event extends EventType<Events>, Data extends EventData<Events, Event>>(
    event: Event,
    ...parameters: Data extends undefined ? [] : [Data]
  ): void => this.listeners.invoke(event, parameters[0]);

  public hasListener = <Event extends EventType<Events>>(event: Event): boolean => this.listeners.hasListener(event);

  public clearAllListeners = (): void => {
    this.listeners.removeAll();
  };
}
