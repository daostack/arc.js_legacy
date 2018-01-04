const defaults = require("../config/default.json");

module.exports.config = {
  get(setting) {
    return defaults[setting];
  },
  set(name, value) {
    defaults[name] = value;
  }
};
