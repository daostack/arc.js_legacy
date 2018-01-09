'use strict';

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load configuration
// First look for overrides from the command line or environment variables
_nconf2.default.argv().env();

// Then look for overrides from modules that are importing arc-js
var path = _nconf2.default.get('arcConfigFile') || 'arc-js.config.json'; // Path to configuration file in calling module
_nconf2.default.file("external", path);

// Then load defaults from our configuration file
_nconf2.default.file("defaults", __dirname + '/../config/default.json');

module.exports.config = _nconf2.default;