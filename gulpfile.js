'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var flatten = require('gulp-flatten');

// var paths = {
//   scss: ['www/scss/**/*.scss'],
//   main: ['/www/scss/new-ui.scss']
// };


gulp.task('scss', function(done) {
  gulp.src('www/scss/main.scss') //source file scss to convert css file
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .on('error', sass.logError)
    .pipe(flatten({ includeParents: 0} ))
    .pipe(gulp.dest('www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/css/'))
    .on('end', done)
});

gulp.task('watch', ['scss'], function() {
  gulp.watch('www/scss/main.scss', ['scss']);
  // gulp.watch(paths.main, ['scss'])
});

gulp.task('default', ['watch']);