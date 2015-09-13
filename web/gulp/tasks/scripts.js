var gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var path = require('../config.js').path;
var errorHandler = require('../errorHandler.js');

gulp.task('scripts', function scriptsTask() {
	return gulp.src(path.src.js)
			.pipe(plumber({errorHandler: errorHandler}))
			// .pipe(sourcemaps.init())
			// .pipe(uglify())
			// .pipe(sourcemaps.write())
			.pipe(gulp.dest(path.build.js))
			.pipe(gulpif(global.watch, connect.reload()));
});
