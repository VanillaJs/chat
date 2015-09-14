var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var errorHandler = require('../errorHandler.js');
var path = require('../config.js').path;

gulp.task('styles',function stylesTask() {
	return gulp.src(path.src.css)
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(gulpif(gutil.env.production, sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulpif(gutil.env.production, cssmin()))
		.pipe(gulpif(gutil.env.production, sourcemaps.write('./')))
		.pipe(gulp.dest(path.build.css))
		.pipe(gulpif(global.watch, connect.reload()));
});
