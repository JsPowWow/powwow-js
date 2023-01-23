import { Maybe } from './';

class Nothing implements Maybe.Nothing {
  isJust(): false {
    return false;
  }

  isNothing(): true {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chain<U>(_: (v: never) => Maybe.Of<U>): Maybe.Of<U> {
    return NOTHING;
  }
}

const NOTHING = Object.freeze(new Nothing());

export { NOTHING as Nothing };
