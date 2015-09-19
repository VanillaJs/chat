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


app.use(morgan()); //логгер

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(config.get('session:secret')));

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    resave: false,
    cookie: config.get('session:cookie'),
    store: require('./lib/database/sessionStore'),
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

// роуты приложения
require('./routes')(app);
app.use(express.static(path.join(__dirname, '/../web/build/')));
//passport init

//"обработчик ошибок"
app.use(function (err, req, res, next) {

	console.log(err.name);
    if (typeof err == 'number') {
        err = new HttpError(err);
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
});

var server = http.createServer(app);
server.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});


var io = require('./socket')(server);
app.set('io', io);
