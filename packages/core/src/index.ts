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
export { default as stubTrue } from './lib/fp/stubTrue';
export { default as stubFalse } from './lib/fp/stubFalse';
export { default as stubNull } from './lib/fp/stubNull';
export { default as toggle } from './lib/fp/toggle';
export { default as call } from './lib/fp/call';

export { default as hasProperty } from './lib/objects/hasProperty';
export { default as removeProperty } from './lib/objects/removeProperty';
export { default as isInstanceOf } from './lib/guards/isInstanceOf';

export { default as sleep } from './lib/async/sleep';
export { default as promiseResolver } from './lib/async/promiseResolver';
