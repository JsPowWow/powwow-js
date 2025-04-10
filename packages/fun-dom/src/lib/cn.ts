// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwn = {}.hasOwnProperty;

export type Value = string | boolean | undefined | null;
export type Mapping = Record<string, unknown>;
export type ArgumentArray = Argument[];
export type ReadonlyArgumentArray = readonly Argument[];
export type Argument = Value | Mapping | ArgumentArray | ReadonlyArgumentArray;

// cn('foo', 'bar'); // => 'foo bar'
// cn('foo', { bar: true }); // => 'foo bar'
// cn({ 'foo-bar': true }); // => 'foo-bar'
// cn({ 'foo-bar': false }); // => ''
// cn({ foo: true }, { bar: true }); // => 'foo bar'
// cn({ foo: true, bar: true }); // => 'foo bar'
//
// // lots of arguments of various types
// cn('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
//
// // other falsy values are just ignored
// cn(null, false, 'bar', undefined, 0, { baz: null }, ''); // => 'bar'

// const arr = ['b', { c: true, d: false }];
// cn('a', arr); // => 'a b c'

// const buttonType = 'primary';
// cn({ [`btn-${buttonType}`]: true });

// TODO AR add them above as jsdoc examples, make it export default function
export function cn(...parameters: ArgumentArray): string {
  let classes = '';

  for (const argument of parameters) {
    if (argument) {
      classes = appendClass(classes, parseValue(argument));
    }
  }

  return classes;
}

function parseValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value !== 'object') {
    return '';
  }

  if (Array.isArray(value)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return cn(...value);
  }

  if (value && value.toString !== Object.prototype.toString && !value.toString.toString().includes('[native code]')) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return value.toString();
  }

  let classes = '';
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const valueObject: Record<string, unknown> = (value ?? {}) as Record<string, unknown>;
  for (const key in valueObject) {
    if (hasOwn.call(valueObject, key) && valueObject[key]) {
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

function appendClass(value: string, newClass: string): string {
  if (!newClass) {
    return value;
  }

  return value ? value + ' ' + newClass : newClass;
}
