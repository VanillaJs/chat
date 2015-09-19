var express = require('express');
var morgan = require('morgan');
var path = require('path');
var http = require('http');
var log = require('./lib/log')(module); //какое-то логирование
var config = require('./config');//все прарметры конфига
var passport = require('./lib/passport');
var mongoose = require('./lib/database/mongoose'); //спец объяев
// ления для инициализирования соединения
var session = require('express-session'); //для того чтобы выставить сессеию в mongo
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var HttpError = require('./error').HttpError;
var errorhandler = require('errorhandler');


function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
};
var app = express();
app.set('main_path', __dirname + path.sep);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//Установка вьюшек для отображения
app.set('views', __dirname + path.sep + '../web/build/');

function serveStatic(response, cache, absPath) {
    // Проверка факта кэширования файла в памяти
    if (cache[absPath]) {
        // Обслуживание файла, находящегося в памяти
        sendFile(response, absPath, cache[absPath]);
    } else {
        // Проверка факта существования файла
        fs.exists(absPath, function(exists) {
            if (exists) {
                // Считывание файла с диска
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        // Обслуживание файла, считанного с диска
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                // Отсылка HTTP-ответа 404
                send404(response);
            }
        });
    }

	if (err.name == 'MongoError') {
		err = new HttpError(403, err.message);
		res.sendHttpError(err);
	}

	if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorhandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
    var absPath = './' + filePath;
    // Обслуживание статического файла
    serveStatic(response, cache, absPath);
});

var server = http.createServer(app);
server.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});

var chatServer = require('./chat_server/server');
chatServer.listen(server);
