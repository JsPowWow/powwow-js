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

export default WsEvent;
