var gulp = require('gulp');
var del = require('del');
var path = require('../config.js').path;

gulp.task('clean', function cleanTask(cb) {
	del(path.clean).then(function() {
		cb();
	});
});
