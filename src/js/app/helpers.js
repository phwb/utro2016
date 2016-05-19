'use strict';

import dateFormat from 'date-format';
import Sync     from './sync';
// настройки приложения
import config   from '../models/config';
// коллекции
import shifts   from '../collections/shifts';
import days     from '../collections/days';
import schedule from '../collections/schedule';
import places   from '../collections/places';
import contacts from '../collections/contacts';
import news     from '../collections/news';
import experts  from '../collections/experts';

// + router
/**
 * Роутер приложения
 *
 * @tutorial http://framework7.io/tutorials/mobile-mvc-apps-with-framework7-requirejs-and-handlerbars.html
 * @param name
 * @returns {Promise}
 */
function load(name) {
  return new Promise(function (resolve, reject) {
    let handler;
    try {
      handler = require('bundle!../controller/' + name);
    } catch (e) {
      reject(e);
    }

    if (!handler) {
      reject();
    }

    handler(function (route) {
      resolve(route);
    });
  });
}

/**
 * Инициализация роутера
 */
export function initRouter() {
  let $ = Framework7.$;

  $(document).on('pageBeforeInit', e => {
    let page = e.detail.page;
    load(page.name)
      .then(route => route(page.container, page.query || {}))
      .catch(e => console.log(e));
  });
}
// - router

// + sync
/**
 * Первым всегда загружается конфиг
 *
 * @returns {Promise}
 */
function fetchConfig() {
  return new Promise(resolve => {
    config.fetch({
      success: resolve,
      error: resolve
    });
  });
}

/**
 * Запуск синхронизации
 *
 * @param {function} callback
 * @returns {Promise}
 */
export function initSync(callback = () => {}) {
  let sync = Promise.resolve();
  sync
    .then(() => console.log('sync:load-config'))
    .then(fetchConfig)
    .then(() => console.log('sync:start'))
    .then(() => new Sync(shifts))
    .then(() => new Sync(days))
    .then(() => new Sync(schedule))
    .then(() => callback())
    .then(() => new Sync(places))
    .then(() => new Sync(contacts))
    .then(() => new Sync(experts))
    .then(() => new Sync(news))
    // .then(() => new Sync(utro24))
    // .then(() => new Sync(forum))
    // .then(() => new Sync(polls))
    .then(() => console.log('sync:end'))
    .catch(e => console.log(e));
  return sync;
}
// - sync

// + форматирование даты
export function formatDate(date) {
  let month = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
  let result = dateFormat.apply(dateFormat, arguments);

  if (typeof(date) === 'string') {
    date = arguments[1];
  }

  return result.replace(/Mm/g, month[date.getMonth()]);
}
// - форматирование даты
