var gulp        = require('gulp'),
      path        = require('../config.js').path,
      config      = require('../../config.js'),
      plumber  = require('gulp-plumber'),
      sourcemaps  = require('gulp-sourcemaps'),
      sass        = require('gulp-sass'),
      prefixer    = require('gulp-autoprefixer'),
      cssmin      = require('gulp-cssmin'),
      sourcemaps  = require('gulp-sourcemaps'),
      connect   = require('gulp-connect');

gulp.task('style:build',function(){
    gulp.src(path.src.css)
        .pipe(plumber({errorHandler: config.errorHandler}))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload())
});