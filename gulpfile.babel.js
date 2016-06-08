'use strict';

// gulp + gulp-plugins
import gulp from 'gulp';
import pug from 'gulp-pug';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import gulplog from 'gulplog';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import uglify from 'gulp-uglify';
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

// let apiUrl = 'http://api.utro2016.ru';
let apiUrl = 'http://utro2016.probitrix.com/local/api';
let path = 'build';

let isDev = () => path === 'build';

export const clean = () => del('./' + path);

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
    .pipe(gulpIf(!isDev(), uglify()))
    .pipe(gulp.dest('./' + path + '/js/vendor'))
    .on('end', function () {
      let f7path = './node_modules/framework7/dist/';
      let build = './' + path + '/js/vendor/framework7/';

      // Framework 7 assets
      gulp.src(f7path + 'css/framework7.ios.min.css').pipe(gulp.dest(build + 'css'));
      gulp.src(f7path + 'img/**').pipe(gulp.dest(build + 'img'));

      // верстка
      gulp.src('./src/assets/js/svg.js').pipe(gulp.dest('./'  + path + '/js/vendor'));
      gulp.src('./src/assets/css/*.css')
        .pipe(gulpIf(!isDev(), cleanCSS()))
        .pipe(gulp.dest('./'  + path + '/css'));
      gulp.src('./src/assets/img/**').pipe(gulp.dest('./'  + path + '/img'));
      gulp.src('./src/assets/fonts/**').pipe(gulp.dest('./'  + path + '/fonts'));
    });
}

export function views() {
  return gulp.src('./src/templates/**/*.jade')
    .pipe(plumber(plumberOptions))
    .pipe(pug({
      data: {
        api: apiUrl,
        dev: isDev()
      },
      pretty: isDev()
    }))
    .pipe(gulp.dest('./' + path));
}

export function webpack(cb) {
  let wp = webpackStream.webpack;
  let firstBuildReady = false;
  let NoErrorsPlugin = wp.NoErrorsPlugin;
  let DefinePlugin = wp.DefinePlugin;
  let Uglify = wp.optimize.UglifyJsPlugin;

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
  // например в коде я использую Promise, для андроида нужно загрузить полифил (наверное, практика покажет)
  let options = {
    output: {
      publicPath: './js/app/'
    },

    watch: isDev(),

    devtool: isDev() ? 'source-map' : false,

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
      new NoErrorsPlugin(),
      new DefinePlugin({
        IS_DEV: JSON.stringify(isDev()),
        API_URL: JSON.stringify(apiUrl)
      })
    ]
  };

  if (!isDev()) {
    options.plugins.push(new Uglify());
  }

  return gulp.src(['./src/js/init.js'])
    .pipe(plumber(plumberOptions))
    .pipe(named())
    .pipe(webpackStream(options, null, done))
    .pipe(gulp.dest('./'  + path + '/js/app'))
    .on('data', function () {
      if (firstBuildReady) {
        cb();
      }
    });
}

export function watch() {
  gulp.watch('./src/templates/**/*.jade', views);
  gulp.watch('./src/assets/**/*.js', assets);
  gulp.watch('./src/assets/**/*.css', assets);
}

export function serve() {
  browserSync.init({
    server: './build',
    notify: false
  });

  browserSync.watch('./build/**/*.*').on('change', browserSync.reload);
}

export function config() {
  return gulp.src('./src/app/config.pug')
    .pipe(plumber(plumberOptions))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      extname: '.xml'
    }))
    .pipe(gulp.dest('./app'));
}

export function appAssets() {
  return gulp.src('./src/app/res/**').pipe(gulp.dest('./app/res'));
}

export const app = gulp.series(
  cb => {
    path = 'app/www';
    cb();
  },
  clean,
  config,
  gulp.parallel(views, assets, appAssets, webpack)
);

const build = gulp.series(
  cb => {
    path = 'build';
    cb();
  },
  clean,
  gulp.parallel(views, assets, webpack),
  gulp.parallel(watch, serve)
);
export default build;
