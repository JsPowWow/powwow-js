export const exhaustiveGuard = (_: never): never => {
  throw new Error(`Not expected value: "${String(_)}"`);
};
