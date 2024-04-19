import { isSomeFunction } from '@powwow-js/nullable';
import {
  EventMapKey,
  EventMap,
  EventListenerCallback,
  IEventEmitter,
} from './types';

export class EventEmitter<T extends EventMap> implements IEventEmitter<T> {
  private listeners: {
    [K in keyof EventMap]?: Array<(p: EventMap[K]) => void>;
  } = {};

  public on = <K extends EventMapKey<T>>(
    eventName: K,
    callback: EventListenerCallback<T[K]>
  ): void => {
    if (
      typeof eventName === 'string' &&
      isSomeFunction<(p: EventMap[K]) => void>(callback)
    ) {
      this.subscribe<K, (p: EventMap[K]) => void>(eventName, callback);
    }
  };

  private subscribe = <
    K extends EventMapKey<T>,
    C extends (p: EventMap[K]) => void
  >(
    eventName: K,
    callback: C
  ): void => {
    this.listeners[eventName] = (this.listeners[eventName] ?? []).concat(
      callback
    );
  };

  public off = <K extends EventMapKey<T>>(
    eventName: K,
    callback: EventListenerCallback<T[K]>
  ): void => {
    if (typeof eventName === 'string' && isSomeFunction(callback)) {
      this.listeners[eventName] = (this.listeners[eventName] ?? []).filter(
        (f) => f !== callback
      );
    }
  };

  public emit = <K extends EventMapKey<T>>(eventName: K, data: T[K]): void => {
    (this.listeners[eventName] ?? []).forEach((fn) => {
      fn(data);
    });
  };

  public hasListener = <K extends EventMapKey<T>>(eventName: K): boolean => {
    return !!this.listeners[eventName];
  };

  public destroy = (): void => {
    this.listeners = {};
  };
}
