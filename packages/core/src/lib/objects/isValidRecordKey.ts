export default function isValidRecordKey(source: unknown): source is PropertyKey {
  return typeof source === 'string' || typeof source === 'number' || typeof source === 'symbol';
}
