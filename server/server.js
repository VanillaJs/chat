var http = require('http');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var session = require('express-session'); // для того чтобы выставить сессию в mongo
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var log = require('./lib/log')(module);
var config = require('./config');
var passport = require('./lib/passport');
var HttpError = require('./error').HttpError;
var app = express();

app.set('main_path', __dirname + path.sep);
app.set('view engine', 'jade');
// Установка вьюшек для отображения
app.set('views', __dirname + path.sep + 'templates');

app.use(morgan(process.env.NODE_ENV === 'develop' ? 'dev' : 'tiny')); // логгер

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
// passport init

// "обработчик ошибок"
app.use(function httpErrorHandler(err, req, res, next) {
	var error = err;
	if (typeof error === 'number') {
		error = new HttpError(error);
	}

	if (error.name === 'MongoError') {
		error = new HttpError(403, error.message);
		res.sendHttpError(error);
	}

	if (error instanceof HttpError) {
		res.sendHttpError(error);
	} else {
		if (app.get('env') === 'development') {
			errorhandler()(error, req, res, next);
		} else {
			log.error(error);
			error = new HttpError(500);
			res.sendHttpError(error);
		}
	}
});

const server = http.createServer(app);
server.listen(config.get('port'), () => log.info('Express server listening on port ' + config.get('port')));

const io = require('./socket')(server);
app.set('io', io);
