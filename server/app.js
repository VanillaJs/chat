var forever = require('forever'),
    fs = require('fs'),
    child = new(forever.Monitor)('server.js', {
        'silent': false,
        'pidFile': 'pids/app.pid',
        'watch': true,
        'watchDirectory': './',      // Top-level directory to watch from.
        'watchIgnoreDotFiles': true, // whether to ignore dot files
        'watchIgnorePatterns': [], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
        'logFile': fs.existsSync('logs/forever.log') ? 'logs/forever.log' : '', // Path to log output from forever process (when daemonized)
        'outFile': fs.existsSync('logs/forever.out') ? 'logs/forever.out' : '', // Path to log output from child stdout
        'errFile': fs.existsSync('logs/forever.err') ? 'logs/forever.err' : ''
    });
child.start();
forever.startServer(child);