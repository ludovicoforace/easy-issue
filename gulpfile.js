'use strict';
const fs = require('fs');
const os = require('os');
const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const open = require('gulp-open');
const pump = require('pump');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const runSequence = require('run-sequence');
const del = require('del');
const ractiveify = require('ractiveify');
ractiveify.extensions.push('ractive');

global.isCompress = false;
global.browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.task('build-js', function () {
  if (!fs.existsSync('./dist')) {
    fs.mkdir('./dist', function () { });
  }
  if (global.isCompress) {
    var bundler = browserify('./src/main.js');
  } else {
    var bundler = watchify(browserify('./src/main.js', { debug: true }));
  }
  bundler
    .transform(babelify.configure({ presets: ['es2015'] }))
    .transform(ractiveify);

  var bund = function () {
    return bundler
      .bundle()
      .on('error', function (err) { console.log('Error : ' + err.message); })
      .pipe(fs.createWriteStream('./dist/main.js'));
  };
  if (!global.isCompress) {
    bundler.on('update', bund);
  }
  return bund();
});

gulp.task('build-css', function () {
  const autoprefix = autoprefixer(
    {
      browsers: ['last 99 versions'],
      cascade: false
    }
  );
  var bundler = gulp
    .src(['./node_modules/sash-layout/**/*.css', './src/less/**/*.less'])
    .pipe(less({
      paths: ['.', './src/less']
    }));

  if (global.isCompress) {
    bundler = bundler
      .pipe(autoprefix)
      .pipe(csso());
  } else {
    bundler = bundler
      .pipe(autoprefix);
  }
  return bundler
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-static', function () {
  const destination = gulp.dest('./dist/');
  const bundler = gulp
    .src([
      './src/img/*.png',
      './src/img/*.jpg',
      './src/img/*.gif',
      './src/img/*.ico',
      './src/other/*.*',
      './src/index.html'
    ]);
  if (global.isCompress) {
    return bundler
      .pipe(imagemin())
      .pipe(destination);
  } else {
    return bundler
      .pipe(destination);
  }
});

gulp.task('update-index', function () {
  const bundler = gulp
    .src('./src/index.html');
  return bundler
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function (cb) {
  return del(['./dist'], cb);
});

gulp.task('open-browser', function () {
  var options = {
    uri: 'http://localhost:3000',
    app: global.browser
  };
  gulp.src(__filename)
    .pipe(open(options));
});

gulp.task('default', function (cb) {
  runSequence('build-js', 'build-css', 'copy-static', 'open-browser', function () {
    const server = require('./server');
    gulp.watch('./src/**/*.less', ['build-css']);
    gulp.watch('./src/index.html', ['update-index']);
    cb();
  });
});

gulp.task('compress', function (cb) {
  runSequence('clean', 'set-compress', 'build-js', 'build-css', 'copy-static', 'compress-js', cb);
});

gulp.task('compress-js', function (cb) {
  pump([
    gulp.src('./dist/**/*.js'),
    uglify(),
    gulp.dest('./dist/')
  ], cb);
});

gulp.task('set-compress', function () {
  global.isCompress = true;
});
