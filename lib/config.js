const defaults = require("../config/default.json");

if (process.env) {
  Object.keys(process.env).forEach((key) => {
    if (defaults[key]) {
      defaults[key] = process.env[key];
    }
  });
}

class Config {
  constructor() {
    if (!Config.instance) {
      this._data = defaults;
      Config.instance = this;
    }
    return Config.instance;
  }

  get(setting) {
    return this._data[setting];
  }

  set(setting, value) {
    this._data[setting] = value;
  }
}

const instance = new Config();
Object.freeze(instance);
module.exports.config = instance;
