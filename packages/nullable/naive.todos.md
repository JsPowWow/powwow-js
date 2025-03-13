```js
import { AnyFunction, Nil, Nullable } from "@/types/utility";

/**
* @description Simple guard to check if provided value is `null` or `undefined`
* @param value
* @returns {boolean}
  */
  export const isNil = (value: unknown): value is Nil => {
  return value === null || value === undefined;
  };

/**
* @description Checks if provided value classified as a {@link Number} primitive
* @param source
* @returns {boolean}
  */
  export const isNumber = (source: unknown): source is number => typeof source === "number" || source instanceof Number;

/**
* @description Simple guard to check if provided value is not `null` and not `undefined`
* @param value
* @returns {boolean}
  */
  export const hasSome = <T>(value: Nullable<T>): value is NonNullable<T> => {
  return value !== null && value !== undefined;
  };

/**
* @description Simple guard to check if provided value is valid and has more than zero length
* @param value
* @returns {boolean}
  */
  export const isNonEmpty = <T extends Nullable<string | Array<unknown>>>(value: T): value is NonNullable<T> => {
  if (!hasSome(value)) {
  return false;
  }
  if (Array.isArray(value) || typeof value === "string") {
  return value.length > 0;
  }
  return false;
  };

/**
* @description Simple guard to check if provided value is nullish or has zero length
* @param value
* @returns {boolean}
  */
  export const isNilOrEmpty = <T extends Nullable<string | Array<unknown>>>(value: T): value is T extends Nil ? T : NonNullable<T> => {
  if (!hasSome(value)) {
  return true;
  }
  if (Array.isArray(value) || typeof value === "string") {
  return value.length === 0;
  }
  return false;
  };

/**
* @description No operation(s) function
  */
  export const noop = (): undefined => {
  // This is intentional
  return undefined;
  };

/**
* @description Always `true` operation
  */
  export const stubTrue = (): true => {
  return true;
  };

/**
* @description Always `null` operation
  */
  export const stubNull = (): null => {
  return null;
  };

/**
* @description Re-return provided value
  */
  export const identity = <T>(p: T) => {
  return p;
  };

/**
* @description Simple guard to check unreachable code using TypeScript with exhaustive type checking
  */
  export const unreachableCheck = (_: never) => {
  // This is intentional
  };

/**
* @description Toggle provided boolean value to opposite one
  */
  export const toggleValue = (v: boolean): boolean => {
  return !v;
  };

type Resolver<Result> = (value: PromiseLike<Result> | Result) => void;
type Rejector<Reason> = (reason: Reason) => void;

export type PromiseResolver<R, E extends Error = Error> = {
promise: Promise<R>;
resolve: Resolver<R>;
reject: Rejector<E>;
};
/**
* @description Promise based helper with exposed promise and it `resolve`, `reject` methods
  */
  export const createPromiseResolver = <R, E extends Error = Error>(): PromiseResolver<R, E> => {
  let promiseResolver: unknown;
  let promiseRejector: unknown;
  const promise = new Promise<R>((resolve, reject) => {
  promiseResolver = resolve;
  promiseRejector = reject;
  });

return {
promise,
resolve: promiseResolver as Resolver<R>,
reject: promiseRejector as Rejector<E>,
};
};

/**
* @description Promisified version of "setTimeout"
  */
  export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
  };

/**
* @description HOC to build new function which is executed provided `method` behalf on origin
  */
  export const withOverriddenFn =
  <Fn extends AnyFunction>(originMethod: Fn) =>
  (override: Fn) => {
  return (...args: Parameters<typeof originMethod>): void => {
  override(...args);
  originMethod(...args);
  };
  };

/**
* @description Return `true` if `source` array has some of from provided `values`
  */
  export const isIncludeSome =
  <S, V extends S = S>(values: V[]) =>
  (source: S[]): boolean => {
  return source.some((src) => {
  return values.find((value) => src === value);
  });
  };

/**
* @description Promisified version of FileReader->readAsText
  */
  export const readFileAsText = (file: File): Promise<string> => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
  fileReader.onload = (e) => {
  resolve((e?.target?.result as string) ?? "");
  };
  fileReader.onerror = (error) => {
  reject(error);
  };
  fileReader.readAsText(file, "");
  });
  };

export const toFilteredNonNullableItems = <T>(list: Nullable<Array<T>>) => list?.concat()?.filter((c): c is NonNullable<T> => hasSome(c)) ?? [];

export const coalesce = <T>(value: Nullable<T>, fallback?: string) => {
if (hasSome(value)) {
return value.toString();
}
return fallback ?? "";
};

export const removeFalsyValues = <T = unknown>(source: Record<string | symbol, T>): Record<string | symbol, T> => {
const newObject = {};
Object.keys(source).forEach((key) => {
if (source[key]) {
newObject[key] = source[key];
}
});
return newObject;
};

export const extractIndexFromKey = (key: string): string => {
return key.split(".")[0].match(/\d+/)?.[0] as string;
};


export const isDeepFrozen = <T extends object>(obj: T): boolean => {
  return (
    Object.isFrozen(obj) && Object.keys(obj).every((prop) => typeof obj[prop] !== 'object' || isDeepFrozen(obj[prop]))
  );
};

export const deepFreeze = <T extends object>(obj: T) => {
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop as keyof T] === 'object' && !Object.isFrozen(obj[prop as keyof T])) {
      deepFreeze(obj[prop as keyof T]);
    }
  });
  return Object.freeze(obj);
};
```
