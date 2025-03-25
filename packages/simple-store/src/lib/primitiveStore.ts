import type { IEventEmitter } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';

export class PrimitiveStore<T> implements Pick<IEventEmitter<{ changed: T }>, 'on' | 'off'> {
  private currentValue;
  private emitter = new EventEmitter<{ changed: T }>();

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  public get value(): T {
    return this.currentValue;
  }

  public set value(newValue: T) {
    if (!Object.is(newValue, this.currentValue)) {
      this.currentValue = newValue;
      this.emitter.emit('changed', this.currentValue);
    }
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }
}
