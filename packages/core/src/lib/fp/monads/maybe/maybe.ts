import hasSome from '../../../objects/hasSome';
import type { Just } from './just';
import { isJust } from './just';
import just from './just';
import type { Nothing } from './nothing';
import { isNothing } from './nothing';
import nothing from './nothing';

export type Maybe<Value> = Just<Value> | Nothing;

export default function maybe<Value>(value: Value | null | undefined): Maybe<Value> {
  return hasSome(value) ? just(value) : nothing();
}

export function isMaybe<Value>(value: unknown): value is Maybe<Value> {
  return isJust(value) || isNothing(value);
}
