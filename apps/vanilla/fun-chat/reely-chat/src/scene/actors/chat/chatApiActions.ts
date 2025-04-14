import { ChatActor } from './ChatActor';
import { assertIsNonNullable, Either, toErrorWithMessage } from '@powwow-js/core';
import { User } from '../../../models/user.model';

export const performLogin = async (
  chat: ChatActor,
  data: { username: string; password: string }
): Promise<Either<Error, User>> => {
  return new Promise((resolve) => {
    const service = chat.context.get().apiService;
    assertIsNonNullable(service);

    service.login(
      { login: data.username, password: data.password },
      {
        onCall: (user) => {
          chat.send('setAuthorized', user);
          resolve(Either.Right(user));
        },
        onError: (payload) => {
          resolve(Either.Left(toErrorWithMessage(payload.error)));
        },
      }
    );
  });
};
