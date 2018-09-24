'use strict';

var gulp = require('gulp');

gulp.task('copy', () => {
  return gulp.src(['src/**/*', '!src/scss', '!src/scss/**/*']).pipe(gulp.dest('dist'));
});