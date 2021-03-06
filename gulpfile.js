var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var source = require('vinyl-source-stream');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var watch = require('gulp-watch');

var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
  target: "ES3",
});

// default task
gulp.task('default', ['transpile'], function() {

});

gulp.task('watch', function () {
  // Endless stream mode
  return watch(['src/**/*.ts', 'src/**/*.tsx', 'typings/index.d.ts', 'node_modules/typescript/lib/lib.es6.d.ts'], function () {
    gulp.start('transpile')
  });
});

// transpilation task from typescript to es5 javascript
gulp.task('transpile', function() {
  return gulp.src(['src/**/*.ts', 'src/**/*.tsx', 'typings/index.d.ts', 'node_modules/typescript/lib/lib.es6.d.ts'])
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
});

// copies all the static files from the demo to the build directories
gulp.task('demo-copy', function() {
  gulp.src(['./demo/index.html', './demo/images/**/*'], { base: './demo' })
    .pipe(gulp.dest('docs'));
});

// transpiles all the demo scss files
gulp.task('demo-scss', function() {
  return gulp.src(['./demo/**/*.{scss,sass}'])
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('docs'));
});

// generates all the demo files in the build directory
gulp.task('demo', ['default', 'demo-copy', 'demo-scss'], function() {
  return gulp.src('demo/index.tsx')
    .pipe(webpackStream(require('./webpack/webpack.demo.js'), webpack))
    .pipe(gulp.dest('docs/'));
});
