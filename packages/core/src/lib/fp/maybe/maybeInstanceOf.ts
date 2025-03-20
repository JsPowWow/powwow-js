import type { ConstructorOf } from '../../types/utility.types';
import isInstanceOf from '../../objects/isInstanceOf';
import Maybe from './Maybe';

export default function maybeInstanceOf<T>(elementType: ConstructorOf<T>) {
  return function (value: unknown): Maybe<T> {
    if (isInstanceOf(elementType, value)) {
      return Maybe.from(value);
    }
    return Maybe.none();
  };
}
