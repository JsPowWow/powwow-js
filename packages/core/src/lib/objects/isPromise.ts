import hasProperty from './hasProperty';
import hasSome from './hasSome';
import isSomeFunction from './isSomeFunction';

export default function isPromise<T>(source: unknown): source is Promise<T> {
  return (
    hasSome(source) &&
    hasProperty('then', source) &&
    isSomeFunction(source['then']) &&
    hasProperty('catch', source) &&
    isSomeFunction(source['catch']) &&
    hasProperty('finally', source) &&
    isSomeFunction(source['finally'])
  );
}
