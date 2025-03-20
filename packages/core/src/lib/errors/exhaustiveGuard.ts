export default function exhaustiveGuard(_: never): never {
  throw new Error(`Not expected "exhaustive" value: "${String(_)}"`);
}
