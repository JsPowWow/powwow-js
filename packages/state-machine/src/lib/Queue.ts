import type { Nullable } from '@powwow-js/core';
import { assertIsNonNullable } from '@powwow-js/core';

// TODO AR revise, move to other lib
class Queue<Task, Result = unknown> {
  private readonly concurrency: number = Number.MAX_SAFE_INTEGER;
  private count = 0;
  private waiting: Task[] = [];
  private onProcess: Nullable<(task: Task) => Promise<Result>>;
  private onDone: Nullable<(error: unknown, result: Nullable<Result>) => void>;
  private onSuccess: Nullable<(result: Nullable<Result>) => void>;
  private onFailure: Nullable<(error: unknown, result: Nullable<Result>) => void>;
  private onDrain: Nullable<() => void> = null;

  constructor(concurrency = Number.MAX_SAFE_INTEGER) {
    this.concurrency = concurrency;
    this.count = 0;
    this.waiting = [];
    this.onProcess = null;
    this.onDone = null;
    this.onSuccess = null;
    this.onFailure = null;
    this.onDrain = null;
  }

  public static channels<T>(concurrency: number): Queue<T> {
    return new Queue(concurrency);
  }

  public add(task: Task): void {
    this.waiting.push(task);
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) this.next();
  }

  public finish(error: unknown, result: Nullable<Result>): void {
    const { onFailure, onSuccess, onDone, onDrain } = this;
    if (error && onFailure) onFailure(error, result);
    else if (onSuccess) onSuccess(result);
    if (onDone) onDone(error, result);
    if (this.count === 0 && this.waiting.length === 0 && onDrain) onDrain();
  }

  public process(listener: (task: Task) => Promise<Result>): typeof this {
    this.onProcess = listener;
    return this;
  }

  public done(listener: (error: unknown, result: Nullable<Result>) => void): typeof this {
    this.onDone = listener;
    return this;
  }

  public success(listener: (result: Nullable<Result>) => void): typeof this {
    this.onSuccess = listener;
    return this;
  }

  public failure(listener: (error: unknown, result: Nullable<Result>) => void): typeof this {
    this.onFailure = listener;
    return this;
  }

  public drain(listener: () => void): typeof this {
    this.onDrain = listener;
    return this;
  }

  private next(): void {
    const emptyChannels = this.concurrency - this.count;
    let launchCount = Math.min(emptyChannels, this.waiting.length);
    while (launchCount-- > 0) {
      this.count++;
      const task = this.waiting.shift();
      assertIsNonNullable(task);
      this.onProcess?.(task)
        .then(
          (result) => void this.finish(null, result),
          (error: unknown) => void this.finish(error, null)
        )
        .finally(() => {
          this.count--;
          if (this.waiting.length > 0) this.next();
        });
    }
  }
}

export default Queue;

// Usage

// const job = ({ name, interval }) =>
//   new Promise((resolve, reject) => {
//     if (interval === 1200) {
//       setTimeout(reject, interval, new Error('Big error!'));
//     } else {
//       setTimeout(resolve, interval, name);
//     }
//   });
//
// const queue = Queue.channels(3)
//   .process(job)
//   .done((error, res) => {
//     const { count } = queue;
//     const waiting = queue.waiting.length;
//     console.log(`Done | res: ${res}, err: ${error}`);
//     console.log(`     | count: ${count}, waiting: ${waiting}`);
//   })
//   // .success((res) => void console.log(`Success: ${res}`))
//   // .failure((err) => void console.log(`Failure: ${err}`))
//   .drain(() => void console.log('Queue drain'));
//
// for (let i = 0; i < 20; i++) {
//   if (i < 10) queue.add({ name: `Task${i}`, interval: 1000 });
//   else queue.add({ name: `Task${i}`, interval: i * 100 });
// }
