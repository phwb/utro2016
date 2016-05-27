'use strict';

import Page   from '../views/news/detail';
import utro24 from '../collections/utro24';

module.exports = function (container, {id} = {}) {
  if (!id) {
    throw new Error('чтобы посмотреть Утро24, нужно передать айдишник');
  }

  let model = utro24.get(id);
  if (!model) {
    throw new Error(`на нашли новость с таким айдишником ${id}`);
  }

  let page = new Page({
    el: container,
    model: model
  });
  page.render();

  return page;
};
