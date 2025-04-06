export const withSelector = <R, S>(store: S, selector: (s: S) => R) => {
  return selector(store);
};
