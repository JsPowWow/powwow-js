'use strict';

// do not edit .js files directly - edit src/index.jst

export default function equal(a, b) {
if (a === b) return true;

if (a && b && typeof a == 'object' && typeof b == 'object') {
if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
}

// true if both NaN, false otherwise
return a !== a && b !== b;
}





/**
* Given two objects, returns the keys that have been added, removed or updated.
* The comparison is shallow—only the first level of keys is compared.
*
* @param {object} oldObj the old object
* @param {object} newObj the new object
* @returns {{added: string[], removed: string[], updated: string[]}}
  */
  export function objectsDiff(oldObj, newObj) {
  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

return {
added: newKeys.filter((key) => !(key in oldObj)),
removed: oldKeys.filter((key) => !(key in newObj)),
updated: newKeys.filter(
(key) => key in oldObj && oldObj[key] !== newObj[key]
),
};
}



export function isNotEmptyString(str) {
return str !== '';
}

export function isNotBlankOrEmptyString(str) {
return isNotEmptyString(str.trim());
}
