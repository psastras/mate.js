// npm i gulp gulp-watch gulp-mocha gulp-batch

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var batch = require('gulp-batch');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

var tsconfig = {
  "module": "commonjs",
  "target": "es6",
  "removeComments": false,
  "preserveConstEnums": true,
  "sourceMap": true,
  "experimentalDecorators": true,
  "declaration": true,
  "allowSyntheticDefaultImports": true,
  "moduleResolution": "node",
  "outDir": ".build/",
  "baseUrl": "lib",
}

gulp.task('compile', function() {
  return watch('lib/**/*.ts', function() {
        gulp.src('lib/**/*.ts', { base: '.' })
          .pipe(ts(tsconfig))
          .pipe(gulp.dest('.build/'))
          .on('end', function() {
            gutil.log(gutil.colors.green('Compilation finished'));
          })
          .on('error', function (err) {
            if (err.stack) gutil.log(gutil.colors.red(err.stack));
          });
   });
})

gulp.task('test', function() {
   return watch('test/**/*.ts', function() {
        gulp.src('test/**/*.ts', { base: '.' })
          .pipe(ts(tsconfig))
          .pipe(gulp.dest('.build/'))
          .pipe(mocha({ reporter: 'dot' }))
          .on('error', function (err) {
            if (err.stack) gutil.log(gutil.colors.red(err.stack));
          });
   });
});

gulp.task('default', ['compile', 'test']);