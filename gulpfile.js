'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
var browserSync = require('browser-sync').create();

process.setMaxListeners(0);

global.paths = {
    'html': './src/**/*.html',
    'scss': './src/scss/**/*.scss',
    'css': './src/css',
    'js': ['./src/**/*.js', '!./src/lib', '!./src/javascript/build.js'],
    'src': './src'
};

global.browserSync = browserSync;

requireDir('./gulp', { recurse: false });
gulp.task('default', gulp.series('serve'));