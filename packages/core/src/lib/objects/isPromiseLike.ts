import hasProperty from './hasProperty';
import hasSome from './hasSome';
import isSomeFunction from './isSomeFunction';

export default function isPromiseLike<T>(source: unknown): source is PromiseLike<T> {
  return hasSome(source) && hasProperty('then', source) && isSomeFunction(source['then']);
}
