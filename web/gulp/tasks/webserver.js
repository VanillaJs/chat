var gulp        = require('gulp'),
      connect     = require('gulp-connect');
      server        = require('../config.js').server;

gulp.task('webserver',function(){
    connect.server({
        host:server.host,
        port:server.port,
        livereload:true
    });
});