export class ValueContext<T> {
  private contextValue;

  constructor(initialValue: T) {
    this.contextValue = initialValue;
  }

  public set value(newValue: T) {
    this.contextValue = newValue;
  }

  public get value() {
    return this.contextValue;
  }
}
