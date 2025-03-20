export const nothingUid = Symbol.for('@powwow-js::nothing');

export type Nothing = {
  [nothingUid]: undefined;
  toString(): string;
};

export default function nothing(): Nothing {
  return {
    [nothingUid]: undefined,
    toString(): string {
      return 'Nothing';
    },
  };
}

export function isNothing(value: unknown): value is Nothing {
  return Object.prototype.hasOwnProperty.call(value, nothingUid);
}
