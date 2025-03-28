import toErrorWithMessage from '../../errors/toErrorWithMessage';

type EitherWrapper<Left, Right> = { either: 'left'; value: Left } | { either: 'right'; value: Right };

function isLeft<Left, Right>(value: EitherWrapper<Left, Right>): value is EitherWrapper<Left, never> {
  return value.either === 'left';
}

function isRight<Left, Right>(value: EitherWrapper<Left, Right>): value is EitherWrapper<never, Right> {
  return value.either === 'right';
}

export class Either<Left, Right> {
  private readonly wrapper: EitherWrapper<Left, Right>;

  private constructor(wrapper: EitherWrapper<Left, Right>) {
    this.wrapper = wrapper;
  }

  public static from = <T>(value: T): Either<never, T> => {
    return Either.Right(value);
  };

  public static tryCatch = <Right>(f: () => Right): Either<Error, Right> => {
    try {
      return Either.Right(f());
    } catch (error) {
      return Either.Left(toErrorWithMessage(error));
    }
  };

  public static Right = <Left = never, Right = never>(value: Right): Either<Left, Right> => {
    return new Either<Left, Right>({ either: 'right', value });
  };

  public static Left = <Left = never, Right = never>(value: Left): Either<Left, Right> => {
    return new Either<Left, Right>({ either: 'left', value });
  };

  public static UnwrapC =
    <L, R>(left: (value: L) => L, right: (value: R) => R) =>
    (either: Either<L, R>): L | R => {
      return isLeft(either.wrapper) ? left(either.wrapper.value) : right(either.wrapper.value);
    };

  public isLeft(): this is Either<Left, never> {
    return this.wrapper.either === 'left';
  }

  public isRight(): this is Either<never, Right> {
    return this.wrapper.either === 'right';
  }

  public map<T>(f: (wrapped: Right) => T): Either<Left, T> {
    return isLeft(this.wrapper) ? Either.Left(this.wrapper.value) : Either.Right(f(this.wrapper.value));
  }

  public mapRight<T>(f: (wrapped: Right) => T): Either<Left, T> {
    return this.map(f);
  }

  public mapLeft<T>(f: (wrapped: Left) => T): Either<T, Right> {
    if (isLeft(this.wrapper)) {
      return Either.Left(f(this.wrapper.value));
    }
    return Either.Right(this.wrapper.value);
  }

  public flatMap<L, R>(f: (wrapped: Right) => Either<L, R>): Either<L | Left, R> {
    return isLeft(this.wrapper) ? Either.Left(this.wrapper.value) : f(this.wrapper.value);
  }

  public tap(f: (wrapped: Left | Right) => void): typeof this {
    f(this.wrapper.value);
    return this;
  }

  public unwrap<L, R>(left: (value: Left) => L, right: (value: Right) => R): L | R {
    return isLeft(this.wrapper) ? left(this.wrapper.value) : right(this.wrapper.value);
  }

  public match<L, R>(pattern: { left: (value: Left) => L; right: (value: Right) => R }): L | R {
    return isLeft(this.wrapper) ? pattern.left(this.wrapper.value) : pattern.right(this.wrapper.value);
  }

  public getOrElse<V>(value: V): V | Right {
    return isRight(this.wrapper) ? this.wrapper.value : value;
  }

  public getOrDefault(defaultValue: Right): Right {
    return isRight(this.wrapper) ? this.wrapper.value : defaultValue;
  }
}
