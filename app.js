const forever = require('forever');
const fs = require('fs');
const child = new(forever.Monitor)('./server/server.js', {
	'silent': process.env.NODE_ENV !== 'develop',
	'pidFile': 'server/pids/app.pid',
	'watch': true,
	'watchDirectory': './',
	'watchIgnoreDotFiles': true,
	'watchIgnorePatterns': [],
	'logFile': fs.existsSync('logs/forever.log') ? 'logs/forever.log' : '',
	'outFile': fs.existsSync('logs/forever.out') ? 'logs/forever.out' : '',
	'errFile': fs.existsSync('logs/forever.err') ? 'logs/forever.err' : '',
});
child.start();
