'use strict';

import Page  from '../views/about/page';
import about from '../collections/about';

module.exports = function (container) {
  let page = new Page({
    el: container,
    collection: about
  });
  page.render();
  return page;
};
