'use strict';

function load(name) {
  return new Promise(function (resolve, reject) {
    let handler;
    try {
      handler = require('bundle!../pages/' + name + '/index.js');
    } catch (e) {
      // TODO: catch error here!!!
      reject();
    }
    if (handler) {
      handler(function (route) {
        resolve(route);
      });
    }
  });
}

export default load;
