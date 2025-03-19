export type Nil = null | undefined;

export type Nullable<T> = T | Nil;

export type RecordKey = string | number | symbol;

export type Primitive = string | boolean | number | null | undefined;

export type UnknownRecord = Record<RecordKey, unknown>;

export type RecordWithMessage<T> = {
  message: T;
};
