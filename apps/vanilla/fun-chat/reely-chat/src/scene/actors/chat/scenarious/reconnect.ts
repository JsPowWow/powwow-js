import { matchAction } from '@powwow-js/state-machine';
import { Either, hasProperty, identity, Maybe, noop, UnknownRecord } from '@powwow-js/core';
import { getItemByKey } from '../../../../shared/persistence';
import { User } from '../../../../models/user.model';
import { ChatActionEffect } from '../ChatActor';
import { APP_STORAGE_KEY } from '../../settings/constants';

const isUserCredentials = (source: unknown): source is Required<User> =>
  hasProperty('login', source) && hasProperty('password', source);

export const tryRestoreUserLogin: ChatActionEffect = (action) =>
  matchAction(action).when({ to: 'ready' }, ({ owner, context }) => {
    const persistedData = Maybe.from(getItemByKey(sessionStorage, APP_STORAGE_KEY).unwrap(noop, identity))
      .map((data) => Either.tryCatch((): UnknownRecord => JSON.parse(data)))
      .map((either) => either.unwrap(noop, identity))
      .getOrDefault({});

    if (isUserCredentials(persistedData)) {
      owner.send('login', { username: persistedData.login, password: persistedData.password }).then(() => {
        context.get().logger?.log('tryRestoreUserLogin')(`"${persistedData.login}" connection restored`);
      });
    }
  });
