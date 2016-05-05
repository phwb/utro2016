'use strict';

function load(name) {
  return new Promise(function (resolve, reject) {
    let handler;
    try {
      handler = require('bundle!../pages/' + name + '/index.js');
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

export default load;
