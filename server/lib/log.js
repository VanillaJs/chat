var winston = require('winston');

var ENV = process.env.NODE_ENV;
var PATH_SEPARATOR = require('path').sep;

function getLogger(module) {

    var path = module.filename.split(PATH_SEPARATOR).slice(-2).join(PATH_SEPARATOR);

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                label: path
            })
        ]
    })
}

module.exports = getLogger;