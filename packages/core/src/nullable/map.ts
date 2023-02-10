import { Nullable, ValueMapper } from '../types';
import { isSome } from './index';

const useMapper =
  <T, O>(fn: ValueMapper<T, O>) =>
  (value: Nullable<T>): Nullable<O> =>
    isSome(value) ? fn(value) ?? null : null;

function map<T, O>(fn: ValueMapper<T, O>, value: Nullable<T>): Nullable<O>;
function map<T, O>(fn: ValueMapper<T, O>): (value: Nullable<T>) => Nullable<O>;
/**
 * @description Returns mapped source value using "fn" function mapper
 */
function map<T, O>(fn: ValueMapper<T, O>, value?: Nullable<T>) {
  const mapper = useMapper(fn);
  if (arguments.length === 1) {
    return mapper;
  }
  return mapper(value);
}

export { map };
