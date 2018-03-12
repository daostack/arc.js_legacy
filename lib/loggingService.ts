import { Config } from "./config";

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
   * the LogLevel
   */
  level: LogLevel;
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

  /* tslint:disable:no-console */
  /* tslint:disable:no-bitwise */
  public level: LogLevel = parseInt(Config.get("logLevel"), 10) as LogLevel;

  public debug(message: string): void { if (this.level & LogLevel.debug) { console.log(message); } }

  public info(message: string): void { if (this.level & LogLevel.info) { console.log(message); } }

  public warn(message: string): void { if (this.level & LogLevel.warn) { console.log(message); } }

  public error(message: string): void { if (this.level & LogLevel.error) { console.log(message); } }
  /* tslint:enable:no-console */
  /* tslint:enable:no-bitwise */
}

export class LoggingService {

  public static logger: ILogger = new ConsoleLogger();

  /* tslint:disable:max-line-length */
  public static debug(message: string): void { LoggingService.logger.debug(`${LoggingService.moduleName} (debug): ${message}`); }

  public static info(message: string): void { LoggingService.logger.info(`${LoggingService.moduleName} (info): ${message}`); }

  public static warn(message: string): void { LoggingService.logger.warn(`${LoggingService.moduleName} (warn): ${message}`); }

  public static error(message: string): void { LoggingService.logger.error(`${LoggingService.moduleName} (error): ${message}`); }
  /* tslint:enable:max-line-length */

  public static setLogLevel(level: LogLevel): void {
    LoggingService.logger.level = level;
  }

  public static setLogger(logger: ILogger): void {
    LoggingService.logger = logger;
  }

  private static moduleName: string = "Arc.js";
}
