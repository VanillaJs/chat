var gulp = require('gulp');
var path = require('../config.js').path;

gulp.task('fonts', function fontsTask() {
	return gulp
		.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});
