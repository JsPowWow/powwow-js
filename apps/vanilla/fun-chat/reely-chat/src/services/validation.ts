import { ExtendedUser } from '../models/user.model';
import { hasSome } from '@powwow-js/core';

export const isValidUsersResponse = (users: unknown): users is ExtendedUser[] => {
  return Array.isArray(users) && users.every((user: unknown) => hasSome<ExtendedUser>(user));
};
