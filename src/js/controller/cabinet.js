'use strict';

import Page from '../views/cabinet/page';

module.exports = function (container) {
  let page = new Page({
    el: container
  });
  page.render();

  return page;
};
