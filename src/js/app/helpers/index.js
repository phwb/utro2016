'use strict';

import Sync from '../../app/sync/index';
// коллекции
import shifts from '../../collections/shifts';
import days from '../../collections/days';
import schedule from '../../collections/schedule';
import places from '../../collections/places';

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
    .then(() => new Sync(places));
}

export {loader, initSync};
