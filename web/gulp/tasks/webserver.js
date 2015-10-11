var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('webserver', function webserverTask() {
	browserSync({
		files: ['build/**/*'],
		proxy: {
			target: 'localhost:3000',
			ws: true
		},
		ghostMode: false,
		open: true,
		ui: false,
		online: true,
		notify: false,
		minify: false
	});
});
