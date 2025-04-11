import { Either, Nullable, toErrorWithMessage } from '@powwow-js/core';
import { ILogger } from '../Logger';

export type SocketConnectionResult = Either<
  { success: false; error: Error; timestamp: number; event: unknown },
  { success: true; socket: WebSocket; timestamp: number; event: unknown }
>;

let log: Nullable<ILogger>;

export const setCreateSocketLogger = <L extends Nullable<ILogger>, R = L extends NonNullable<L> ? L : undefined>(
  logger: L
): R => {
  log = logger;
  return log as R;
};

export default function createSocket(url: string): Promise<SocketConnectionResult> {
  return new Promise((resolve, _reject) => {
    try {
      const ws = new WebSocket(url);
      ws.addEventListener(
        'open',
        (event) => {
          log?.info('Connected', url);

          resolve(Either.Right({ success: true, socket: ws, timestamp: performance.now(), event }));
        },
        { once: true }
      );
      ws.addEventListener(
        'error',
        (event) => {
          log?.warn('Connection error', url);
          resolve(
            Either.Left({ success: false, error: new Error('Connection failed.'), timestamp: performance.now(), event })
          );
        },
        { once: true }
      );
    } catch (error) {
      resolve(
        Either.Left({ success: false, error: toErrorWithMessage(error), timestamp: performance.now(), event: error })
      );
    }
  });
}
