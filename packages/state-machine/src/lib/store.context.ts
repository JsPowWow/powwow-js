import { RecordKey } from '@powwow-js/nullable';

export class StoreContext<T extends Record<RecordKey, unknown>> {
  private context;

  constructor(initialValue: T) {
    this.context = initialValue;
  }

  public set<K extends keyof T>(reducer: (ctx: T) => Pick<T, K>): typeof this;
  public set<K extends keyof T>(slice: Pick<T, K> | undefined): typeof this;
  public set<K extends keyof T>(updater: Pick<T, K> | undefined | ((ctx: T) => Pick<T, K>)): typeof this {
    if (typeof updater === 'function') {
      this.context = { ...this.context, ...updater(this.context) };
    }
    if (updater && typeof updater === 'object') {
      this.context = { ...this.context, ...updater };
    }
    return this;
  }

  public get() {
    return this.context;
  }
}
