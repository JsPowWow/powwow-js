import type { RecordKey } from '@powwow-js/nullable';
import type { IEventEmitter } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';

export class StoreContext<T extends Record<RecordKey, unknown>>
  implements Pick<IEventEmitter<{ changed: T }>, 'on' | 'off'>
{
  private context;
  private emitter = new EventEmitter<{ changed: T }>();

  constructor(initialValue: T) {
    this.context = initialValue;
  }

  public set<K extends keyof T>(updater: Pick<T, K> | ((context: T) => Pick<T, K>)): typeof this {
    if (typeof updater === 'function') {
      this.context = { ...this.context, ...updater(this.context) };
      this.emitter.emit('changed', this.context);
    }
    if (updater && typeof updater === 'object') {
      this.context = { ...this.context, ...updater };
      this.emitter.emit('changed', this.context);
    }
    return this;
  }

  public get(): T {
    return this.context;
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }
}
