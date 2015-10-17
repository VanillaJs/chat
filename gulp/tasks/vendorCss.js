var gulp = require('gulp');
var path = require('../config.js').path;
var concat = require('gulp-concat');

gulp.task('vendorCss', function vandorCssTask() {
	return gulp
		.src(path.src.vendorsCss)
    .pipe(concat('vendor.css'))
		.pipe(gulp.dest(path.build.vendorsCss));
});
