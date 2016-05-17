'use strict';

import Page from '../views/place/list';

module.exports = function (container) {
  let page = new Page({
    el: container
  });
  page.render();

  return page;
};
