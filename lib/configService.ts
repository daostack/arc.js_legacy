/**
 * get and set global Arc.js settings
 */
export class ConfigService {
  public static instance: ConfigService;
  public static data: any;

  public static get(setting: string): any {
    return ConfigService.data[setting];
  }

  public static set(setting: string, value: any): void {
    ConfigService.data[setting] = value;
  }

  constructor() {
    if (!ConfigService.instance) {
      const defaults = require("../config/default.json");
      const prefix = "arcjs_";
      if (process && process.env) {
        Object.keys(process.env).forEach((key: string) => {
          if (key.startsWith(prefix)) {
            const internalKey = key.replace(prefix, "");
            if (defaults.hasOwnProperty(internalKey)) {
              defaults[internalKey] = process.env[key];
            }
          }
        });
      }

      ConfigService.data = defaults;
      ConfigService.instance = this;
    }
    return ConfigService.instance;
  }
}

/**
 * This will automagically create a static instance of ConfigService that will be used whenever
 * someone imports ConfigService.
 */
Object.freeze(new ConfigService());
