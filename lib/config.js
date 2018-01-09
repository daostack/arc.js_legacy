import nconf from 'nconf';

// Load configuration
// First look for overrides from the command line or environment variables
nconf.argv().env();

// Then look for overrides from modules that are importing arc-js
const path = nconf.get('arcConfigFile') || 'arc-js.config.json'; // Path to configuration file in calling module
nconf.file("external", path);

// Then load defaults from our configuration file
nconf.file("defaults", __dirname + '/../config/default.json');

module.exports.config = nconf;