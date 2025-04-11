import { Message } from './message.model';

export interface User {
  login: string;
  password?: string;
  isLogined?: boolean;
}

export interface ExtendedUser extends User {
  messages: Message[];
}
