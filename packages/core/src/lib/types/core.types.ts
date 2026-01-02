export type Nil = null | undefined;

export type Nullable<T> = T | Nil;

export type UnknownRecord = Record<PropertyKey, unknown>;

export type RecordWithMessage<T> = {
  message: T;
};

// export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
