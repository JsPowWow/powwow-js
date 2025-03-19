import type { Nil, RecordKey } from './core.types';

export type ConstructorOf<T> = { prototype: T; new (...parameters: never[]): T };

export type ValueOf<T> = T[keyof T];

export type NullableValuesOf<T> = { [P in keyof T]: T[P] | Nil };

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

export type DeepPartial<T> = T extends Record<RecordKey, unknown> ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/** @description Takes an object type and makes the hover overlay more readable */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** @description Extract properties of T that are type of V */
export type KeysWithType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
