/**
 * @description Checks if provided value can be classified as a `Symbol`
 */
export default function isSymbol(source: unknown): source is symbol {
  return typeof source === 'symbol';
}
