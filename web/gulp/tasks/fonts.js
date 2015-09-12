var gulp        = require('gulp'),
      path        = require('../config.js').path;

gulp.task('fonts:build',function(){
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});