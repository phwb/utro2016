'use strict';

import dateFormat from 'date-format';
import Sync from '../../app/sync/index';
// коллекции
import shifts from '../../collections/shifts';
import days from '../../collections/days';
import schedule from '../../collections/schedule';
import places from '../../collections/places';
import contacts from '../../collections/contacts';

function loader(name) {
  return new Promise(function (resolve, reject) {
    let handler;
    try {
      handler = require('bundle!../../pages/' + name + '/index.js');
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

function initSync() {
  let sync = new Sync(shifts);
  sync
    .then(() => new Sync(days))
    .then(() => new Sync(schedule))
    .then(() => new Sync(places))
    .then(() => new Sync(contacts));
}

function formatDate(date) {
  let month = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
  let result = dateFormat.apply(dateFormat, arguments);

  if (typeof(date) === 'string') {
    date = arguments[1];
  }

  return result.replace(/Mm/g, month[date.getMonth()]);
}

export {loader, initSync, formatDate};
