export default function isObjectTypeOf(type: string, source: unknown): boolean {
  return Object.prototype.toString.call(source) === `[object ${type}]`;
}
