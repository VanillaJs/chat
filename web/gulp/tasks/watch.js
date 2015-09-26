var gulp = require('gulp');
var watch = require('gulp-watch');
var path = require('../config.js').path;

gulp.task('watch', function watchTask() {
	global.watch = true;
	watch([path.watch.js], function(event,cb) {
		gulp.start('scripts');
	});
	watch([path.watch.css], function(event,cb) {
		gulp.start('styles');
	});
	watch([path.watch.img], function(event,cb) {
		gulp.start('images');
	});
	watch([path.watch.fonts], function(event,cb) {
		gulp.start('fonts');
	});
});
