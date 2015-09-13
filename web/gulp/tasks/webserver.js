var gulp = require('gulp');
var connect = require('gulp-connect');
var server = require('../config.js').server;

gulp.task('webserver',function webserverTask() {
		connect.server({
			host: server.host,
			port: server.port,
			livereload: true,
			root: './build',
		});
});
