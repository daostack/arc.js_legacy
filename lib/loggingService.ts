import * as JSON from "circular-json";

export enum LogLevel {
  none = 0,
  info = 1,
  warn = 2,
  debug = 4,
  error = 8,
  all = 15,
}

export interface ILogger {
  /**
   * Logs a debug message.
   *
   * @param message The message to log.
   */
  debug(message: string): void;

  /**
   * Logs info.
   *
   * @param message The message to log.
   */
  info(message: string): void;

  /**
   * Logs a warning.
   *
   * @param message The message to log.
   */
  warn(message: string): void;

  /**
   * Logs an error.
   *
   * @param message The message to log.
   */
  error(message: string): void;
}

class ConsoleLogger implements ILogger {

  /* tslint:disable:max-line-length */
  /* tslint:disable:no-console */
  /* tslint:disable:no-bitwise */
  public debug(message: string): void { if (LoggingService.logLevel & LogLevel.debug) { console.log(`${LoggingService.moduleName} (debug): ${message}`); } }

  public info(message: string): void { if (LoggingService.logLevel & LogLevel.info) { console.log(`${LoggingService.moduleName} (info): ${message}`); } }

  public warn(message: string): void { if (LoggingService.logLevel & LogLevel.warn) { console.log(`${LoggingService.moduleName} (warn): ${message}`); } }

  public error(message: string): void { if (LoggingService.logLevel & LogLevel.error) { console.log(`${LoggingService.moduleName} (error): ${message}`); } }
  /* tslint:enable:no-console */
  /* tslint:enable:no-bitwise */
  /* tslint:enable:max-line-length */
}

/**
 * Provides logging support, logging by default to the JavaScript console.  You can provide
 * alternate or additional loggers by using `LoggingService.addLogger` and `LoggingService.removeLogger`.
 *
 * You can set the `LogLevel` by setting `LoggingService.logLevel` with flags from [LogLevel](/api/enums/LogLevel/)
 * or by using the [ConfigService](Configuration#logging).
 *
 * Logically, LogLevels are simply or'd together, there is no hierarchy to them.
 */
export class LoggingService {

  public static loggers: Array<ILogger> = [new ConsoleLogger()];

  public static logLevel: LogLevel = LogLevel.none;

  public static moduleName: string = "Arc.js";

  public static debug(message: string): void {
    LoggingService.loggers.forEach((logger: ILogger) => {
      logger.debug(message);
    });
  }

  public static info(message: string): void {
    LoggingService.loggers.forEach((logger: ILogger) => {
      logger.info(message);
    });
  }

  public static warn(message: string): void {
    LoggingService.loggers.forEach((logger: ILogger) => {
      logger.warn(message);
    });
  }

  public static error(message: string): void {
    LoggingService.loggers.forEach((logger: ILogger) => {
      logger.error(message);
    });
  }

  /**
   * Log a message at potentially multiple levels instead of just one.
   *
   * The message will be logged just once, at the first log level in the intersection between
   * the given log level and the current log level, in the following order of precendence:
   *
   *  1. error
   *  2. warn
   *  3. info
   *  4. debug
   *
   * So if the current log level is info|error and you call `message("a message", LogLevel.info|LogLevel.error)`
   * then you will see the message logged as an error.
   *
   * @param message
   * @param level log level(s)
   */
  public static message(message: string, level: LogLevel = LoggingService.logLevel): void {

    if (level === LogLevel.none) {
      return;
    }

    // only issue the message once
    let messaged: boolean = false;

    /* tslint:disable:no-bitwise */
    if (level & LogLevel.error) {
      LoggingService.error(message);
      messaged = true;
    }
    if (!messaged && (level & LogLevel.warn)) {
      LoggingService.warn(message);
      messaged = true;
    }
    if (!messaged && (level & LogLevel.info)) {
      LoggingService.info(message);
      messaged = true;
    }
    if (!messaged && (level & LogLevel.debug)) {
      LoggingService.debug(message);
    }
    /* tslint:enable:no-bitwise */
  }

  public static addLogger(logger: ILogger): void {
    LoggingService.loggers.push(logger);
  }

  public static removeLogger(logger: ILogger): void {
    const ndx = LoggingService.loggers.indexOf(logger);
    if (ndx >= 0) {
      LoggingService.loggers.splice(ndx, 1);
    }
  }

  public static stringifyObject(obj: any): string {
    return JSON.stringify(obj);
  }
}
