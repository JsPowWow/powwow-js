import WebSocketService from './WebSocketService';
import { User, ExtendedUser } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { RequestType } from '../../models/request-type.enum';
import { WsCallback } from '../../models/ws-event.model';

export class WebSocketChatService extends WebSocketService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  login(user: User, callback: WsCallback<User>): void {
    this.send(RequestType.UserLogin, { user }, callback);
  }

  logout(user: User, callback: WsCallback<User>): void {
    this.send(RequestType.UserLogout, { user }, callback);
  }

  getActiveUsers(callback: WsCallback<{ users: ExtendedUser[] }>): void {
    this.send(RequestType.UserActive, null, callback);
  }

  getInactiveUsers(callback: WsCallback<{ users: ExtendedUser[] }>): void {
    this.send(RequestType.UserInactive, null, callback);
  }

  getUserMessages(user: User, callback: WsCallback<{ messages: Message[] }>): void {
    this.send(RequestType.MessageFromUser, { user }, callback);
  }

  sendMessage(message: Partial<Message>, callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageSend, { message }, callback);
  }

  sendRead(messages: Partial<Message>[]): void {
    messages.forEach((message) => this.send(RequestType.MessageRead, { message }));
  }

  sendDelete(message: Partial<Message>, callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageDelete, { message }, callback);
  }

  sendEdit(message: Partial<Message>, callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageEdit, { message }, callback);
  }

  notifyLogin(callback: WsCallback<{ user: User }>): void {
    this.send(RequestType.UserExternalLogin, undefined, callback, true);
  }

  notifyLogout(callback: WsCallback<{ user: User }>): void {
    this.send(RequestType.UserExternalLogout, undefined, callback, true);
  }

  notifyDelivered(callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageDeliver, undefined, callback, true);
  }

  notifySend(callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageSend, undefined, callback, true);
  }

  notifyRead(callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageRead, undefined, callback, true);
  }

  notifyDeleted(callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageDelete, undefined, callback, true);
  }

  notifyEdited(callback: WsCallback<{ message: Message }>): void {
    this.send(RequestType.MessageEdit, undefined, callback, true);
  }
}
