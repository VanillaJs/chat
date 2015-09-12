var gulp        = require('gulp'),
      path        = require('../config.js').path,
      del      = require('del');

gulp.task('clean',function(cb){
    del(path.clean,cb);
});