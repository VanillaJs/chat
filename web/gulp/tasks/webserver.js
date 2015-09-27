var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('webserver', function webserverTask() {
	browserSync({
		files: ['build/**/*'],
		proxy: {
			target: 'localhost:3000',
			ws: true
		},
		open: true,
		ui: false,
		online: false,
		notify: false,
		minify: false
	});
});
