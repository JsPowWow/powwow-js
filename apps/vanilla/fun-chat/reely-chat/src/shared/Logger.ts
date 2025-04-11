type AnyValue = unknown;

const DEFAULT_LOGGER = 'default';
const logInstances = new Map<string, ScopedLogger>();
const enabledScopedLoggers = new Map();

export interface ILogger {
  info: (...parameters: AnyValue[]) => void;
  warn: (...parameters: AnyValue[]) => void;
  error: (...parameters: AnyValue[]) => void;
  log: (message: string, logLevel?: 'info' | 'warn' | 'error') => <A>(a: A) => A;
}

export type WithDebugOptions<T> =
  | (T & {
      debug: true;
      logger: ILogger;
    })
  | (T & { debug?: false });

export type DebugOption = WithDebugOptions<NonNullable<object>>;

export interface ScopedLogger extends ILogger {
  setEnabled: (value: boolean) => ScopedLogger;
  get scope(): string;
}

const setLoggerEnabled = (logger: ScopedLogger, enable: boolean): void => {
  if (enable) {
    enabledScopedLoggers.set(logger, true);
  } else {
    enabledScopedLoggers.delete(logger);
  }
};

const isLoggerEnabled = (logger: ScopedLogger): boolean =>
  logger && (logger.scope === DEFAULT_LOGGER || enabledScopedLoggers.get(logger) === true);

class ConsoleLoggerScoped implements ScopedLogger {
  private readonly loggerScope: string;

  constructor(scope: string) {
    this.loggerScope = scope;
  }

  public get scope(): string {
    return this.loggerScope;
  }

  public get enabled(): boolean {
    return isLoggerEnabled(this);
  }

  public setEnabled = (value: boolean): typeof this => {
    setLoggerEnabled(this, value);
    return this;
  };

  public info = (...parameters: unknown[]): void => {
    if (isLoggerEnabled(this)) {
      console.info(`[[${this.loggerScope}]]\t`, ...parameters);
    }
  };

  public warn = (...parameters: unknown[]): void => {
    if (isLoggerEnabled(this)) {
      console.warn(`[[${this.loggerScope}]]\t`, ...parameters);
    }
  };

  public error = (...parameters: unknown[]): void => {
    if (isLoggerEnabled(this)) {
      console.error(`[[${this.loggerScope}]]\t`, ...parameters);
    }
  };

  public log =
    (message: string, logLevel?: 'info' | 'warn' | 'error') =>
    <A>(a: A): A => {
      if (isLoggerEnabled(this)) {
        switch (logLevel) {
          case 'info': {
            this.info(message, a);
            break;
          }
          case 'warn': {
            this.warn(message, a);
            break;
          }
          case 'error': {
            this.error(message, a);
            break;
          }
          default: {
            this.info(message, a);
          }
        }
      }
      return a;
    };
}

export const getLogger = (scope = DEFAULT_LOGGER): ScopedLogger => {
  const thisScope = scope || DEFAULT_LOGGER;
  let logger = logInstances.get(scope);
  if (!logger) {
    logger = Object.freeze(new ConsoleLoggerScoped(thisScope));
    logInstances.set(thisScope, logger);
  }
  return logger;
};

export default getLogger(DEFAULT_LOGGER);
