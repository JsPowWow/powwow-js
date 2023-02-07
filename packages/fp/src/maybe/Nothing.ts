import { Maybe } from './';

class Nothing implements Maybe.Nothing {
  isJust(): false {
    return false;
  }

  isNothing(): true {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(_: (v: never) => U): Maybe.Of<U> {
    return NOTHING;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fMap<U>(_: (v: never) => Maybe.Of<U>): Maybe.Of<U> {
    return NOTHING;
  }

  match<U>(options: { just: (_: never) => never; nothing: () => U }): U {
    return options.nothing();
  }
}

const NOTHING: Maybe.Nothing = Object.freeze(new Nothing());

export { NOTHING as Nothing };
