import { isSomeFunction, RecordKey } from '@powwow-js/nullable';

export class StoreContext<T extends Record<RecordKey, unknown>> {
  private context;

  constructor(initialValue: T) {
    this.context = initialValue;
  }

  public set<K extends keyof T>(reducer: (ctx: T) => Pick<T, K>): typeof this;
  public set<K extends keyof T>(slice: Pick<T, K>): typeof this;
  public set<K extends keyof T>(updater: Pick<T, K> | ((ctx: T) => Pick<T, K>)): typeof this {
    if (isSomeFunction<<C>(ctx: C) => Pick<T, K>>(updater)) {
      this.context = { ...this.context, ...updater(this.context) };
    }
    this.context = { ...this.context, ...updater };
    return this;
  }

  public get() {
    return this.context;
  }
}
