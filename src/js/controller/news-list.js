'use strict';

import Page from '../views/news/page';
import news from '../collections/news';

module.exports = function (container) {
  let page = new Page({
    collection: news,
    el: container
  });
  page.render();

  return page;
};
