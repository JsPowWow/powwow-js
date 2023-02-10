import { INothing, Maybe } from './types';

class Nothing implements INothing {
  readonly tag = 'AlwaysNothing';

  isJust(): false {
    return false;
  }

  isNothing(): true {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(_: (v: never) => U): Maybe<U> {
    return NOTHING;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fMap<U>(_: (v: never) => Maybe<U>): Maybe<U> {
    return NOTHING;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filter(_: (v: never) => boolean): Maybe<never> {
    return NOTHING;
  }

  match<U>(options: { just: (_: never) => never; nothing: () => U }): U {
    return options.nothing();
  }
}

const NOTHING = new Nothing();

export { NOTHING as Nothing };
