var nconf = require('nconf');
var defaultConfig = require('./default');
var local;

try {
	local = require('./local.js');
} catch (e) {
	local = {};
}

nconf.overrides(local);
nconf.env().argv();
nconf.defaults(defaultConfig);

module.exports = nconf;
