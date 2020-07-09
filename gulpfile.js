'use strict';

var gulp = require('gulp');
var scss = require('gulp-sass');
var sourcemap = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var del = require('del');
var server = require('browser-sync').create();

gulp.task('css', function () {
  return gulp.src('source/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(scss())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('js', function () {
  return gulp.src('source/js/*.js')
    .pipe(sourcemap.init())
    .pipe(plumber())
    .pipe(gulp.dest('build/js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}*')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo(),
    ]))
    .pipe(gulp.dest('source/img'))
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2,otf}',
    'source/img/**',
    'source/favicon.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/scss/**/*.scss', gulp.series('css'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*/*.js', gulp.series('js', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('build', gulp.series('clean', 'copy', 'css', 'js', 'html'));
gulp.task('start', gulp.series('build', 'server'));
