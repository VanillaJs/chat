var gulp        = require('gulp'),
      path       = require('../config.js').path,
      imagemin    = require('gulp-imagemin'),
      pngquant    = require('imagemin-pngquant'),
      connect     = require('gulp-connect');

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