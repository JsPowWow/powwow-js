class EventObserver<Listener> {
  private observers: Set<(data: Listener) => void>;

  constructor() {
    this.observers = new Set();
  }

  subscribe(observer: (data: Listener) => void): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: (data: Listener) => void): void {
    this.observers.delete(observer);
  }

  notify(data: Listener): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

export default EventObserver;
