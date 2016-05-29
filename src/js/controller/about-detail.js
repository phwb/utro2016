'use strict';

import Page  from '../views/about/detail';
import about from '../collections/about';

module.exports = function (container, {id} = {}) {
  if (!id) {
    throw new Error('чтобы посмотреть "о Форуме", нужно передать айдишник');
  }

  let model = about.get(id);
  if (!model) {
    throw new Error(`на нашли модель форума с таким айдишником ${id}`);
  }

  let page = new Page({
    el: container,
    model: model
  });
  page.render();

  return page;
};
