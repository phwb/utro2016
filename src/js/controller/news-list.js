'use strict';

import Page from '../views/news/page';

module.exports = function (container) {
  let page = new Page({
    el: container
  });
  page.render();

  return page;
};
