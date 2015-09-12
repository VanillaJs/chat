var gulp        = require('gulp'),
      path       = require('../config.js').path,
      config      = require('../../config.js'),
      plumber    = require('gulp-plumber'),
      rigger      = require('gulp-rigger'),
      connect     = require('gulp-connect');

gulp.task('js:build',function(){
    gulp.src(path.src.js)
        .pipe(plumber({errorHandler: config.errorHandler}))
        .pipe(rigger())/*
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())*/
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload())
});