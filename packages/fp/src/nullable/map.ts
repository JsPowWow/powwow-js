import { Nullable } from './index';

type Mapper<T, O> = (value: T) => O;

const useMapper =
  <T, O>(fn: Mapper<T, O>) =>
  (value: Nullable.Of<T>): Nullable.Of<O> =>
    Nullable.isSome(value) ? fn(value) ?? null : null;

function map<T, O>(fn: Mapper<T, O>, value: Nullable.Of<T>): Nullable.Of<O>;
function map<T, O>(fn: Mapper<T, O>): (value: Nullable.Of<T>) => Nullable.Of<O>;

function map<T, O>(fn: Mapper<T, O>, value?: Nullable.Of<T>) {
  const mapper = useMapper(fn);
  if (arguments.length === 1) {
    return mapper;
  }
  return mapper(value);
}

export { map };
