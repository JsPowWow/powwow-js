export type ValueMapper<T, O> = (value: T) => O;
export type Nil = null | undefined;
export type Nullable<T> = T | Nil;
