export type Identity<T> = (x: T) => T;

export default function identity<T>(v: T): T {
  return v;
}
