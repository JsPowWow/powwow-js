import { Maybe } from './Maybe';
import isRecordKey from '../../objects/isRecordKey';

const maybeRecordKey =
  <T extends Record<string | number | symbol, unknown>>(object: T) =>
  (key: unknown): Maybe<keyof T> =>
    isRecordKey(key, object) ? Maybe.of(key) : Maybe.none();

export default maybeRecordKey;
