import type { IEventEmitter } from '@powwow-js/emitter';
import { EventEmitter } from '@powwow-js/emitter';

export class ValueContext<T> implements Pick<IEventEmitter<{ changed: T }>, 'on' | 'off'> {
  private contextValue;
  private emitter = new EventEmitter<{ changed: T }>();

  constructor(initialValue: T) {
    this.contextValue = initialValue;
  }

  public get value(): T {
    return this.contextValue;
  }

  public set value(newValue: T) {
    if (!Object.is(newValue, this.contextValue)) {
      this.contextValue = newValue;
      this.emitter.emit('changed', this.contextValue);
    }
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...parameters: P): void {
    return this.emitter.on.apply(this, parameters);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...parameters: P): void {
    return this.emitter.off.apply(this, parameters);
  }
}
