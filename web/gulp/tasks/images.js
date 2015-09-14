var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var connect = require('gulp-connect');
var path = require('../config.js').path;

gulp.task('images', function imagesTask() {
	return gulp.src(path.src.img)
			.pipe(imagemin({
					progressive: true,
					svgoPlugins: [{
						removeViewBox: false
					}],
					use: [
						pngquant()
					],
					interlaced: true
			}))
			.pipe(gulp.dest(path.build.img))
			.pipe(gulpif(global.watch, connect.reload()));
});
