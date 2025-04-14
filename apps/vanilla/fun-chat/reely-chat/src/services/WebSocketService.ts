interface WsEvent<Payload = object> {
  id: string;
  type: string;
  payload: Payload | WsErrorPayload;
}

export interface WsErrorPayload {
  error: string;
}

export interface WsCallback<T = object> {
  onCall: (payload: T) => void;
  onError?: () => void;
}

export default abstract class WebSocketService {
  protected socket: WebSocket;
  protected readonly callbacks: Map<string, WsCallback<unknown>[]> = new Map();

  private messages: string[] = [];

  protected constructor(socket: WebSocket) {
    this.socket = socket;
    this.start();
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

  private start() {
    this.socket.addEventListener('message', ({ data }: MessageEvent<string>) => {
      const { id, type, payload } = JSON.parse(data) as WsEvent;
      const callbacks = this.callbacks.get(id) || this.callbacks.get(type);
      if (!callbacks?.length) {
        return;
      }

      callbacks.forEach((callback) => {
        if (type === 'ERROR') {
          // const { error } = payload as WsErrorPayload;
          // this.notificationService.error('Error', error);
          callback.onError?.();
          return;
        }

        callback.onCall(payload);
      });
    });

    this.socket.addEventListener('close', (event) => {
      console.log('Connection closed:', event.reason);
      // notificationService.globalError('Connection lost', `${event.reason}\nAttempting to reconnect...`);
      // setTimeout(() => this.connect(), 5000);
    });

    this.socket.addEventListener('error', (event) => {
      console.log('Connection error:', event);

      // notificationService.globalError('Connection lost', `${event.reason}\nAttempting to reconnect...`);
      // setTimeout(() => this.connect(), 5000);
    });
  }
}
