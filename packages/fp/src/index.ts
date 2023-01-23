enum MaybeType {
  Just = 'powwowJs::MaybeType:Just',
  Nothing = 'powwowJs::MaybeType:Nothing',
}

interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

interface Nothing {
  type: typeof MaybeType.Nothing;
}

type Nil = null | undefined;

const isNil = (value: unknown): value is Nil => value === null || value === undefined;

type Maybe<T> = Just<T> | Nothing;

const Nothing = (): Readonly<Nothing> => Object.freeze({ type: MaybeType.Nothing });

const Just = <T>(value: T): Readonly<Just<T>> => Object.freeze({ type: MaybeType.Just, value });

const maybeOf = <T>(value: T): Maybe<T> => (!isNil(value) ? Just(value) : Nothing());

// function maybeMap<A, B>(f: (val: A) => B, m: IMaybe<A>): IMaybe<B> {
//   switch (m.type) {
//     case MaybeType.Nothing:
//       return Nothing();
//     case MaybeType.Just:
//       return Just(f(m.value));
//   }
// }

// function maybeAndThen<A, B>(f: (val: A) => IMaybe<B>, m: IMaybe<A>): IMaybe<B> {
//   switch (m.type) {
//     case MaybeType.Nothing:
//       return Nothing();
//     case MaybeType.Just:
//       return f(m.value);
//   }
// }

// function maybeWithDefault<T>(defaultVal: T, m: IMaybe<T>): T {
//   switch (m.type) {
//     case MaybeType.Nothing:
//       return defaultVal;
//     case MaybeType.Just:
//       return m.value;
//   }
// }

const Maybe = {
  of: maybeOf,
  // andThen: curry(maybeAndThen),
  // map: curry(maybeMap),

  // withDefault: curry(maybeWithDefault),
};

export { Maybe };

// ~~~~~~~~~~~~~~~~~~~~~~~~~

// type UpperCaseHead = (list: ReadonlyArray<string>) => IMaybe<string>;
// const upperCaseHead: UpperCaseHead = compose(IMaybe.map(toUpper), safeHead) as UpperCaseHead;
//
// console.log(upperCaseHead([])); // { type: IMaybe.Nothing } ie. Nothing
// console.log(upperCaseHead(['rick', 'morty'])); // { type: IMaybe.Just, value: 'RICK' } ie. Just 'RICK'

// const safeHead = <T> (list: ReadonlyArray<T>): IMaybe<T> =>
//   list.length === 0
//     ? Nothing()
//     : Just(list[0])

// const greet = (maybeName: IMaybe<string>): string => {
//   switch (maybeName.type) {
//     case MaybeType.Nothing:
//       return 'Pleased to meet you!'
//     case MaybeType.Just:
//       return `Good to see you again ${maybeName.value}`
//   }
// }
