var gulp        = require('gulp'),
      path        = require('../config.js').path,
      config      = require('../../config.js'),
      plumber  = require('gulp-plumber'),
      jade        = require('gulp-jade'),
      prettify    = require('gulp-html-prettify'),
      connect   = require('gulp-connect');

gulp.task('html:build',function(){
    gulp.src(path.src.html)
        .pipe(plumber({errorHandler: config.errorHandler}))
        .pipe(jade())
        .pipe(prettify({
            brace_style: 'expand',
            indent_size: 1,
            indent_char: '\t',
            indent_inner_html: true,
            preserve_newlines: true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload())
});