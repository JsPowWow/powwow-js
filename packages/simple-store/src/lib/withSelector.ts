export default function withSelector<R, S>(store: S, selector: (s: S) => R): R {
  return selector(store);
}
