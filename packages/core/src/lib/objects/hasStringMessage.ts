import isPlainObject from './isPlainObject';
import hasProperty from './hasProperty';
import isString from './isString';
import type { RecordWithMessage } from '../types/core.types';

export default function hasStringMessage(source: unknown): source is RecordWithMessage<string> {
  return isPlainObject(source) && hasProperty('message', source) && isString(source['message']);
}
