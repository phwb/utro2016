'use strict';

import dateFormat from 'date-format';
import Sync       from './sync';
import config     from '../models/config';
import shifts     from '../collections/shifts';
import days       from '../collections/days';
import schedule   from '../collections/schedule';
import places     from '../collections/places';
import contacts   from '../collections/contacts';
import news       from '../collections/news';
import experts    from '../collections/experts';
import polls      from '../collections/polls';
import utro24     from '../collections/utro24';
import about      from '../collections/about';
import notify     from '../collections/notify';

// + logger
let log = true;
export function logger() {
  if (log) {
    console.log.apply(console, arguments);
  }
}
logger.info = function () {
  if (log) {
    console.info.apply(console, arguments);
  }
};
logger.error = function () {
  if (log) {
    console.error.apply(console, arguments);
  }
};
// - logger

// + update notify
/**
 * самая простая функция автообновления раз в 60 секунд
 */
let $ = Backbone.$;

function searchNewNotify() {
  let newer = notify.filter(model => model.get('isNew') === true);
  let $tip = $('.b-tip__body');

  if (newer.length) {
    $tip.show().text(newer.length);
  } else {
    $tip.hide().text('');
  }
}

function updateNotify() {
  searchNewNotify();
  notify.on('add change', searchNewNotify);
  setTimeout(() => notify.refresh().then(() => updateNotify()), 60000);
}
// - update notify

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
      .then(searchNewNotify)
      .catch(e => console.error(e));
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
  return sync
    .then(fetchConfig)
    .then(() => console.time('Время загрузки приложения'))
    .then(() => new Sync(shifts))
    .then(() => new Sync(days))
    .then(() => new Sync(notify))
    .then(() => callback())
    .then(() => new Sync(places))
    .then(() => new Sync(contacts))
    .then(() => new Sync(experts))
    .then(() => new Sync(news))
    .then(() => new Sync(utro24))
    .then(() => new Sync(about))
    .then(() => new Sync(polls))
    .then(() => new Sync(schedule))
    .then(updateNotify)
    .catch(e => console.error(e))
    .then(() => console.timeEnd('Время загрузки приложения'));
}
// - sync

// + форматирование даты
export function formatDate(date) {
  let month = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
  let result = dateFormat.apply(dateFormat, arguments);
  let daysName = 'ВС ПН ВТ СР ЧТ ПТ СБ'.split(' ');

  if (typeof(date) === 'string') {
    date = arguments[1];
  }

  return result
    .replace(/Mm/g, month[date.getMonth()])
    .replace(/D/g, daysName[date.getDay()]);
}
// - форматирование даты
