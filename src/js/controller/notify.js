'use strict';

import Page   from '../views/notify/page';
import notify from '../collections/notify';

module.exports = function (container) {
  let page = new Page({
    el: container,
    collection: notify
  });
  page.render();
  return page;
};
