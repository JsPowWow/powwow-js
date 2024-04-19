export type Nil = null | undefined;
export type Nullable<T> = T | Nil;
export type ValueMapper<T, O> = (value: T) => O;
export type PartialShape<T extends object> = {
  [P in keyof T]?: Nullable<T[P]>;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
