'use strict';

let gulp = require('gulp');
let reload = global.browserSync.reload;
let url = require('url');
let fs = require('fs');

gulp.task('browsersync', () => {
  global.browserSync.init({
    server: [global.paths.src],
    ghostMode: true,
    middleware: function(req, res, next) {
      var fileName = url.parse(req.url).pathname;
      var fileExists = fs.existsSync('src/' + fileName);
      if (!fileExists && fileName.indexOf("browser-sync-client") < 0 || fileName === '/') {
        req.url = '/404.html';
      }
      return next();
    }
  });

  gulp.watch([global.paths.html, global.paths.js]).on('change', reload);
  gulp.watch(global.paths.scss, gulp.series('css'));
});

gulp.task('serve', gulp.series('css', 'browsersync'));