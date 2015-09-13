var gulp = require('gulp');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var prettify = require('gulp-html-prettify');
var connect = require('gulp-connect');
var path = require('../config.js').path;
var errorHandler = require('../errorHandler.js');

gulp.task('templates', function templatesTask() {
	return gulp
			.src(path.src.html)
			.pipe(plumber({errorHandler: errorHandler}))
			.pipe(jade())
			.pipe(prettify({
				brace_style: 'expand',
				indent_size: 1,
				indent_char: '\t',
				indent_inner_html: true,
				preserve_newlines: true
			}))
			.pipe(gulp.dest(path.build.html))
			.pipe(gulpif(global.watch, connect.reload()));
});
