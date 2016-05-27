'use strict';

import Page   from '../views/news/page';
import utro24 from '../collections/utro24';

module.exports = function (container) {
  let page = new Page({
    collection: utro24,
    el: container,
    href: function (model) {
      let id = model.get('id');
      return `utro24/detail.html?id=${id}`;
    }
  });
  page.render();

  return page;
};
