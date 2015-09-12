var gulp        = require('gulp'),
       watch       = require('gulp-watch'),
       path        = require('../config.js').path;

gulp.task('watch',function(){
    watch([path.watch.html],function(event,cb){
        gulp.start('html:build');
    });
    watch([path.watch.js],function(event,cb){
        gulp.start('js:build');
    });
    watch([path.watch.css],function(event,cb){
        gulp.start('style:build');
    });
    watch([path.watch.img],function(event,cb){
        gulp.start('image:build');
    });
    watch([path.watch.fonts],function(event,cb){
        gulp.start('fonts:build');
    });
});