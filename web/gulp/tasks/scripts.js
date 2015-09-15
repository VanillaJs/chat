var gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var webpackStream = require('webpack-stream');
var connect = require('gulp-connect');
var path = require('../config.js').path;
var webpackConfig = require('../../webpack.config.js');
var errorHandler = require('../errorHandler.js');

gulp.task('scripts', function scriptsTask() {
	return gulp.src(path.src.js)
			.pipe(plumber({errorHandler: errorHandler}))
			.pipe(webpackStream(webpackConfig))
			.pipe(gulp.dest(path.build.js))
			.pipe(gulpif(global.watch, connect.reload()));
});
