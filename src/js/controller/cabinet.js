'use strict';

import Page from '../views/cabinet/page';

module.exports = function (container, {tab = ''} = {}) {
  let page = new Page({
    el: container,
    tab: tab
  });
  page.render();

  return page;
};
