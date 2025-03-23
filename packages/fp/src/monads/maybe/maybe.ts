import type { Just } from './just';
import just, { isJust } from './just';
import type { Nothing } from './nothing';
import nothing, { isNothing } from './nothing';
import { hasSome } from '@powwow-js/core';

export type Maybe<Value> = Just<Value> | Nothing;

export default function maybe<Value>(value: Value | null | undefined): Maybe<Value> {
  return hasSome(value) ? just(value) : nothing();
}

export function isMaybe<Value>(value: unknown): value is Maybe<Value> {
  return isJust(value) || isNothing(value);
}
