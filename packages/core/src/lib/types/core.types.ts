export type Nil = null | undefined;

export type Nullable<T> = T | Nil;

export type ConstructorOf<T> = { prototype: T; new (...parameters: never[]): T };

export type Primitive = string | boolean | number | null | undefined;
