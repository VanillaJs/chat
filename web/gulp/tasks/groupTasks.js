var gulp = require('gulp');

gulp.task('default',[
    'clean',
    'build',
    'webserver',
    'watch'
]);

gulp.task('build',[
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build'
]);