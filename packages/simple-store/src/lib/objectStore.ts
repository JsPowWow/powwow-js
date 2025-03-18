import type { RecordKey } from '@powwow-js/core';
import type { IEventEmitter } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';

export class ObjectStore<T extends Record<RecordKey, unknown>>
  implements Pick<IEventEmitter<{ changed: T }>, 'on' | 'off'>
{
  private storeValue;
  private emitter = new EventEmitter<{ changed: T }>();

  constructor(initialValue: T) {
    this.storeValue = initialValue;
  }

  public set<K extends keyof T>(updater: Pick<T, K> | ((store: T) => Pick<T, K>)): typeof this {
    if (typeof updater === 'function') {
      this.storeValue = { ...this.storeValue, ...updater(this.storeValue) };
      this.emitter.emit('changed', this.storeValue);
    }
    if (updater && typeof updater === 'object') {
      this.storeValue = { ...this.storeValue, ...updater };
      this.emitter.emit('changed', this.storeValue);
    }
    return this;
  }

  public get(): T {
    return this.storeValue;
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }
}
