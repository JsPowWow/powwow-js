import { hasProperty, hasSome, isBoolean } from '@powwow-js/core';
import { UserMessage } from './message.model';

export interface User {
  login: string;
  password?: string;
  isLogined?: boolean;
}

export type RemoteUser = Omit<User, 'password'>;

export type ChatUser = RemoteUser & { messages: UserMessage[] };

const isValidRemoteUser = (user: unknown): user is RemoteUser => {
  return hasSome(user) && hasProperty('login', user) && hasProperty('isLogined', user) && isBoolean(user.isLogined);
};
export const isValidRemoteUsers = (users: unknown): users is RemoteUser[] => {
  return Array.isArray(users) && users.every(isValidRemoteUser);
};
