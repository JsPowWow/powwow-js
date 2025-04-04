const hasOwn = {}.hasOwnProperty;

export type Value = string | boolean | undefined | null;
export type Mapping = Record<string, unknown>;
export type ArgumentArray = Array<Argument>;
export type ReadonlyArgumentArray = ReadonlyArray<Argument>;
export type Argument = Value | Mapping | ArgumentArray | ReadonlyArgumentArray;

// classNames('foo', 'bar'); // => 'foo bar'
// classNames('foo', { bar: true }); // => 'foo bar'
// classNames({ 'foo-bar': true }); // => 'foo-bar'
// classNames({ 'foo-bar': false }); // => ''
// classNames({ foo: true }, { bar: true }); // => 'foo bar'
// classNames({ foo: true, bar: true }); // => 'foo bar'
//
// // lots of arguments of various types
// classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
//
// // other falsy values are just ignored
// classNames(null, false, 'bar', undefined, 0, { baz: null }, ''); // => 'bar'

// const arr = ['b', { c: true, d: false }];
// classNames('a', arr); // => 'a b c'

// const buttonType = 'primary';
// classNames({ [`btn-${buttonType}`]: true });

export function cn(...parameters: ArgumentArray) {
  let classes = '';

  for (const argument of parameters) {
    if (argument) {
      classes = appendClass(classes, parseValue(argument));
    }
  }

  return classes;
}

function parseValue(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value !== 'object') {
    return '';
  }

  if (Array.isArray(value)) {
    return cn(...value);
  }

  if (value && value.toString !== Object.prototype.toString && !value.toString.toString().includes('[native code]')) {
    return value.toString();
  }

  let classes = '';
  const valueObject: Record<string, unknown> = (value ?? {}) as Record<string, unknown>;
  for (const key in valueObject) {
    if (hasOwn.call(valueObject, key) && valueObject[key]) {
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

function appendClass(value: string, newClass: string) {
  if (!newClass) {
    return value;
  }

  return value ? value + ' ' + newClass : newClass;
}
