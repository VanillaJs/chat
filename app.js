var forever = require('forever'),
    fs = require('fs'),
    child = new(forever.Monitor)('./server/server.js', {
        'silent': false,
        'pidFile': 'server/pids/app.pid',
        'watch': true,
        'watchDirectory': './',
        'watchIgnoreDotFiles': true,
        'watchIgnorePatterns': [],
        'logFile': fs.existsSync('logs/forever.log') ? 'logs/forever.log' : '',
        'outFile': fs.existsSync('logs/forever.out') ? 'logs/forever.out' : '',
        'errFile': fs.existsSync('logs/forever.err') ? 'logs/forever.err' : ''
    });
child.start();
forever.startServer(child);
