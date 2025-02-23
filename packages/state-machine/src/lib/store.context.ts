import { isSomeFunction, RecordKey } from '@powwow-js/nullable';

export class StoreContext<T extends Record<RecordKey, unknown>> {
  private context;

  constructor(initialValue: T) {
    this.context = initialValue;
  }
  public set(reducer: (ctx: T) => Partial<T>): typeof this;
  public set(slice: Partial<T>): typeof this;
  public set(updater: Partial<T> | ((ctx: T) => Partial<T>)): typeof this {
    if (isSomeFunction<<C>(ctx: C) => Partial<T>>(updater)) {
      this.context = { ...this.context, ...updater(this.context) };
    }
    this.context = { ...this.context, ...updater };
    return this;
  }

  public get() {
    return this.context;
  }
}
