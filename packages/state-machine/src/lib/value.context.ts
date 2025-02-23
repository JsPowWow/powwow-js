import { EventEmitter, IEventEmitter } from '@powwow-js/emitter';

export class ValueContext<T> implements Pick<IEventEmitter<{ changed: T }>, 'on' | 'off'> {
  private contextValue;
  private emitter = new EventEmitter<{ changed: T }>();

  constructor(initialValue: T) {
    this.contextValue = initialValue;
  }

  public set value(newValue: T) {
    if (!Object.is(newValue, this.contextValue)) {
      this.contextValue = newValue;
      this.emitter.emit('changed', this.contextValue);
    }
  }

  public get value() {
    return this.contextValue;
  }

  public on<P extends Parameters<typeof this.emitter.on>>(...params: P): void {
    return this.emitter.on.apply(this, params);
  }

  public off<P extends Parameters<typeof this.emitter.off>>(...params: P): void {
    return this.emitter.off.apply(this, params);
  }
}
