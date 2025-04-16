import { UnknownRecord } from '@powwow-js/core';

export interface WsCallback<T = object, E = UnknownRecord> {
  onCall: (payload: T) => void;
  onError?: (error: E) => void;
}

export default abstract class WebSocketService {
  protected socket: WebSocket;
  protected readonly callbacks: Map<string, WsCallback<unknown>[]> = new Map();
  private abortController: AbortController;
  private messages: string[] = [];

  protected constructor(socket: WebSocket) {
    this.socket = socket;
    this.abortController = new AbortController();
  }

  protected send<T>(type: string, payload: unknown, callback?: WsCallback<T>, isNotification = false): void {
    const id = isNotification ? null : crypto.randomUUID();
    this.addCallback<T>(id || type, callback);

    if (payload !== undefined) {
      this.messages.push(JSON.stringify({ id, type, payload }));
      this.sendMessages();
    }
  }

  private sendMessages() {
    if (this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.messages.forEach((message) => this.socket.send(message));
    this.messages = [];
  }

  protected addCallback<T>(id: string, callback?: WsCallback<T>): void {
    const wsCallback = callback as WsCallback<unknown>;

    if (!callback) {
      return;
    }

    if (this.callbacks.has(id)) {
      this.callbacks.get(id)?.push(wsCallback);
      return;
    }

    this.callbacks.set(id, [wsCallback]);
  }

  public start() {
    this.socket.addEventListener(
      'message',
      ({ data }: MessageEvent<string>) => {
        const { id, type, payload } = JSON.parse(data);
        const callbacks = this.callbacks.get(id) || this.callbacks.get(type);
        if (!callbacks?.length) {
          return;
        }

        callbacks.forEach((callback) => {
          if (type === 'ERROR') {
            callback.onError?.(payload);
            return;
          }

          callback.onCall(payload);
        });
      },
      { signal: this.abortController.signal }
    );

    // this.socket.addEventListener(
    //   'close',
    //   (event) => {
    //     console.log('Connection closed:', event.reason);
    //     // notificationService.globalError('Connection lost', `${event.reason}\nAttempting to reconnect...`);
    //     // setTimeout(() => this.connect(), 5000);
    //   },
    //   { signal: this.abortController.signal }
    // );

    // this.socket.addEventListener(
    //   'error',
    //   (event) => {
    //     console.log('Connection error:', event);
    //
    //     // notificationService.globalError('Connection lost', `${event.reason}\nAttempting to reconnect...`);
    //     // setTimeout(() => this.connect(), 5000);
    //   },
    //   { signal: this.abortController.signal }
    // );

    return this;
  }

  public dispose() {
    this.abortController.abort();
  }
}
