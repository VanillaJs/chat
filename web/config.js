var gutil = require('gulp-util');

function errorHandler(error) {
	gutil.log([
		(error.name + ' in ' + error.plugin).bold.red,
		'',
		error.message,
		'',
	].join('\n'));

	this.emit('end');
}

module.exports.errorHandler = errorHandler;