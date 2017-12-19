var gulp = require('gulp');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var nodemon = require('nodemon');

var config = {
  publicDir: 'server/assets',
};

gulp.task('css', function() {
  gulp.src('server/assets/scss/index.scss')
  .pipe(changed('server/assets/css/'))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('server/assets/css'));
});

gulp.task('serve', function () {
 //livereload.listen();
  nodemon({
   script: 'server/app.js',
   ext: 'js',
   env: {'env': 'development'}
  }).on('restart', function () {
  });
});

gulp.task('watch', function () {
  gulp.watch('server/assets/scss/*.scss', ['css']);
});

gulp.task('default', ['css','watch','serve']);
