var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function defaultTask() {
	runSequence(
		'build',
		'webserver',
		'watch'
	);
});

gulp.task('build', function buildTask(cb) {
	runSequence(
		'clean',
		'fonts',
		'images',
		// 'styles',
		'scripts',
		'templates',
		cb
	);
});
