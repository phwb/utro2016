/* переменная webpack */
/* global IS_DEV */

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
import registerPushwooshAndroid from './pushwoosh/android';
import registerPushwooshIOS     from './pushwoosh/ios';

// + logger
let log = IS_DEV;
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

// + инициализация StatusBar
export function initStatusBar(color = '#31b5e8') {
  if (!window.hasOwnProperty('StatusBar')) {
    return false;
  }

  StatusBar.backgroundColorByHexString(color);
}
// - инициализация StatusBar

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
    $tip.hide();
  }
}

// подписываемся на событие добавления/изменения модели уведомлений
notify.on('add change', searchNewNotify);
// начальные настройки таймера обновления
let timer = null;
let timeout = 60000;
function updateNotify() {
  notify.refresh().then(() => {
    searchNewNotify();
    timer = setTimeout(updateNotify, timeout);
  });
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
export function initRouter(app) {
  let $ = Framework7.$;

  $(document).on('pageBeforeInit', e => {
    let page = e.detail.page;
    load(page.name)
      .then(route => route(page.container, page.query || {}))
      .then(() => {
        if (page.name === 'map') {
          app.params.swipePanel = false;
        } else if (!app.params.swipePanel) {
          app.params.swipePanel = 'left';
        }
      })
      .then(searchNewNotify)
      .catch(e => console.error(e));
  });
}
// - router

// + alert
export function myAlert(arg) {
  let params = {
    message: '',
    callback: function () {},
    title: 'Внимание!',
    button: 'ОК'
  };
  if (typeof arg === 'string') {
    params.message = arg;
  }
  if (navigator.notification) {
    navigator.notification.alert(params.message, params.callback, params.title, params.button);
  } else {
    alert(params.message);
  }
}
// - alert

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
    .catch(e => {
      myAlert('Ошибка интернет соединения!');
      logger.error(e);
    })
    .then(updateNotify);
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

// + инициализация pushwoosh
function pushCallback() {
  clearTimeout(timer);
  updateNotify();
}

export function initPushwoosh() {
  if (device.platform.toLowerCase() === 'android') {
    registerPushwooshAndroid(pushCallback);
  }

  if (device.platform.toLowerCase() === 'iphone' || device.platform.toLowerCase() === 'ios') {
    registerPushwooshIOS(pushCallback);
  }
}
// - инициализация pushwoosh

