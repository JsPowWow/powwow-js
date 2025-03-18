export * from './lib/types/core.types';
export * from './lib/types/function.types';
export * from './lib/types/object.types';

export { default as isNil } from './lib/guards/isNil';
export { default as hasSome } from './lib/guards/hasSome';
export { default as isSomeFunction } from './lib/guards/isSomeFunction';
export { default as isString } from './lib/guards/isString';
export { default as isNumber } from './lib/guards/isNumber';

export { default as identity } from './lib/fp/identity';
export { default as noop } from './lib/fp/noop';

export { default as hasProperty } from './lib/objects/hasProperty';
export { default as removeProperty } from './lib/objects/removeProperty';
