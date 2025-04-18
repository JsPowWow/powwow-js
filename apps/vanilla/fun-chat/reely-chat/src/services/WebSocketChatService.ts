import WebSocketService, { WsCallback } from './WebSocketService';
import { RemoteUser, User } from '../models/user';
import { Message } from '../models/message.model';

export const enum RequestType {
  UserExternalLogin = 'USER_EXTERNAL_LOGIN',
  UserExternalLogout = 'USER_EXTERNAL_LOGOUT',
  MessageSend = 'MSG_SEND',
  MessageFromUser = 'MSG_FROM_USER',
  MessageRead = 'MSG_READ',
  MessageDeliver = 'MSG_DELIVER',
  MessageDelete = 'MSG_DELETE',
  MessageEdit = 'MSG_EDIT',
}

export class WebSocketChatService extends WebSocketService {
  constructor(socket: WebSocket) {
    super(socket);
  }

  login(user: User, callback: WsCallback<{ user: User }>): typeof this {
    this.send('USER_LOGIN', { user }, callback);
    return this;
  }

  logout(user: User, callback: WsCallback<User>): typeof this {
    this.send('USER_LOGOUT', { user }, callback);
    return this;
  }

  getActiveUsers(callback: WsCallback<{ users: RemoteUser[] }>): typeof this {
    this.send('USER_ACTIVE', null, callback);
    return this;
  }

  getInactiveUsers(callback: WsCallback<{ users: RemoteUser[] }>): typeof this {
    this.send('USER_INACTIVE', null, callback);
    return this;
  }

  notifyLogin(callback: WsCallback<{ user: RemoteUser }>): typeof this {
    this.send('USER_EXTERNAL_LOGIN', undefined, callback, true);
    return this;
  }

  notifyLogout(callback: WsCallback<{ user: RemoteUser }>): typeof this {
    this.send('USER_EXTERNAL_LOGOUT', undefined, callback, true);
    return this;
  }

  getUserMessages(user: User, callback: WsCallback<{ messages: Message[] }>): typeof this {
    this.send(RequestType.MessageFromUser, { user }, callback);
    return this;
  }

  sendMessage(message: Partial<Message>, callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageSend, { message }, callback);
    return this;
  }

  sendRead(messages: Partial<Message>[]): typeof this {
    messages.forEach((message) => this.send(RequestType.MessageRead, { message }));
    return this;
  }

  sendDelete(message: Partial<Message>, callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageDelete, { message }, callback);
    return this;
  }

  sendEdit(message: Partial<Message>, callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageEdit, { message }, callback);
    return this;
  }

  notifyDelivered(callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageDeliver, undefined, callback, true);
    return this;
  }

  notifySend(callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageSend, undefined, callback, true);
    return this;
  }

  notifyRead(callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageRead, undefined, callback, true);
    return this;
  }

  notifyDeleted(callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageDelete, undefined, callback, true);
    return this;
  }

  notifyEdited(callback: WsCallback<{ message: Message }>): typeof this {
    this.send(RequestType.MessageEdit, undefined, callback, true);
    return this;
  }
}
