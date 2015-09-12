'use strict';
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    cssmin      = require('gulp-cssmin'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    prettify    = require('gulp-html-prettify'),
    plumber    = require('gulp-plumber'),
    rigger      = require('gulp-rigger'),
    jade        = require('gulp-jade'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    connect     = require('gulp-connect'),
    opn         = require('opn'),
    config      = require('./config.js');
var path = {
    build:{
        html    : 'build/',
        js      : 'build/js/',
        css     : 'build/css/',
        img     : 'build/img/',
        fonts   : 'build/fonts/'
    },
    src:{
        html    : 'src/templates/*.jade',
        js      : 'src/js/main.js',
        css     : 'src/style/*.{scss,sass,css}',
        img     : 'src/img/**/*.*',
        fonts   : 'src/fonts/**/*.*'
    },
    watch:{
        html    : 'src/**/*.jade',
        js      : 'src/js/**/*.js',
        css     : 'src/style/**/*.{scss,sass,css}',
        img     : 'src/img/**/*.*',
        fonts   : 'src/fonts/**/*.*'
    },
    clean: "build"
};
var server = {
    host        : 'localhost',
    port        : '8888'
};
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
gulp.task('js:build',function(){
    gulp.src(path.src.js)
        .pipe(plumber({errorHandler: config.errorHandler}))
        .pipe(rigger())/*
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())*/
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload())
});
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
gulp.task('image:build',function(){
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive:true,
            svgoPlugins:[{
                removeViewBox:false
            }],
            use:[
                pngquant()
            ],
            interlaced:true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(connect.reload())
});
gulp.task('fonts:build',function(){
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('build',[
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build'
]);
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
gulp.task('webserver',function(){
    connect.server({
        host:server.host,
        port:server.port,
        livereload:true
    });
});
gulp.task('clean',function(cb){
    rimraf(path.clean,cb);
});
gulp.task('openbrowser',function(){
    opn('http://'+server.host+':'+server.port+'/build');
});
gulp.task('default',[
    'clean',
    'build',
    'webserver',
    'watch'
    //'openbrowser'
]);