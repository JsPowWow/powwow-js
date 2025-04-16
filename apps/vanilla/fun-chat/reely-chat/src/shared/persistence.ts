import { Either } from '@powwow-js/core';

export const setItemByKey = (storage: Storage, key: string, value: string): Either<Error, void> =>
  Either.tryCatch(() => storage.setItem(key, value));

export const getItemByKey = (storage: Storage, key: string): Either<Error, string | null> =>
  Either.tryCatch(() => storage.getItem(key));
