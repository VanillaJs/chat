var gulp = require('gulp');
var watch = require('gulp-watch');
var path = require('../config.js').path;

gulp.task('watch', function watchTask() {
	global.watch = true;
	watch([path.watch.js], function() {
		gulp.start('scripts');
	});
	watch([path.watch.img], function() {
		gulp.start('images');
	});
	watch([path.watch.fonts], function() {
		gulp.start('fonts');
	});
});
