import { Either, Nullable, toErrorWithMessage } from '@powwow-js/core';
import { ILogger } from './Logger';

export type SocketConnectionResult = Either<
  { success: false; error: Error; timestamp: number; event: unknown },
  { success: true; socket: WebSocket; timestamp: number; event: unknown }
>;

export default function createSocket(url: string, options?: { logger?: ILogger }): Promise<SocketConnectionResult> {
  const log: Nullable<ILogger> = options?.logger;
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
          log?.error('Socket connection failed', url);
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
