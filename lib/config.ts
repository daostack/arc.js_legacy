/**
 * get and set global Arc.js settings
 */
export default class Config {
  static instance: Config;
  static _data: any;

  constructor() {
    if (!Config.instance) {
      const defaults = require("../config/default.json");

      if (process && process.env) {
        Object.keys(process.env).forEach((key) => {
          if (defaults[key]) {
            defaults[key] = process.env[key];
          }
        });
      }

      Config._data = defaults;
      Config.instance = this;
    }
    return Config.instance;
  }

  public static get(setting: string): any {
    return Config._data[setting];
  }

  public static set(setting: string, value: any): void {
    Config._data[setting] = value;
  }
}

/**
 * This will automagically create a static instance of Config that will be used whenever
 * someone imports Config.
 */
Object.freeze(new Config());
