'use strict';

// gulp + gulp-plugins
import gulp from 'gulp';
import pug from 'gulp-pug';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import gulplog from 'gulplog';
// webpack
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
// common modules
import del from 'del';
import browserSync from 'browser-sync';

browserSync.create();

const plumberOptions = {
  errorHandler: notify.onError()
};

export const clean = () => del('./build');

export function assets() {
  let vendor = [
    './node_modules/framework7/dist/js/framework7.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/underscore/underscore.js',
    './node_modules/backbone/backbone.js',
    './node_modules/localforage/dist/localforage.js',
    './node_modules/localforage-backbone/dist/localforage.backbone.js'
  ];

  return gulp.src(vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js/vendor'))
    .on('end', function () {
      let f7path = './node_modules/framework7/dist/';
      let build = './build/js/vendor/framework7/';

      gulp.src(f7path + 'css/framework7.ios.min.css').pipe(gulp.dest(build + 'css'));
      gulp.src(f7path + 'img/**').pipe(gulp.dest(build + 'img'));
    });
}

export function views() {
  return gulp.src('./src/templates/**/*.jade')
    .pipe(plumber(plumberOptions))
    .pipe(pug())
    .pipe(gulp.dest('./build'));
}

export function webpack(cb) {
  let wp = webpackStream.webpack;
  let NoErrorsPlugin = wp.NoErrorsPlugin;
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) {
      return;
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));
  }

  // тут нужно учитывать сборку под разные оси, и использовать полифилы
  // например в коде я использую Promise, для андроида нужно загрузить полифил
  let options = {
    output: {
      publicPath: '/js/app/'
    },

    watch: true,

    devtool: 'source-map',

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.jade$/,
          loader: 'pug-html'
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },

    plugins: [
      new NoErrorsPlugin()
    ]
  };

  return gulp.src(['./src/js/init.js'])
    .pipe(plumber(plumberOptions))
    .pipe(named())
    .pipe(webpackStream(options, null, done))
    .pipe(gulp.dest('./build/js/app'))
    .on('data', function () {
      if (firstBuildReady) {
        cb();
      }
    });
}

export function watch() {
  gulp.watch('./src/templates/**/*.jade', views);
  gulp.watch('./src/assets/**/*.js', assets);
}

export function serve() {
  browserSync.init({
    server: './build',
    notify: false
  });

  browserSync.watch('./build/**/*.*').on('change', browserSync.reload);
}

const build = gulp.series(
  clean,
  gulp.parallel(views, assets, webpack),
  gulp.parallel(watch, serve)
);
export default build;
