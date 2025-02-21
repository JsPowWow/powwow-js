export type Nil = null | undefined;
export type Nullable<T> = T | Nil;
export type ConstructorOf<T> = { new (...args: never[]): T; prototype: T };
export type ValueOf<T> = T[keyof T];
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
export type RecordKey = string | number | symbol;
