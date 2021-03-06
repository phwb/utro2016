'use strict';

import Page from '../views/schedule/page';

module.exports = function (container, {day, place = 0} = {}) {
  // по сути ID площадки не обязательно, если площадка не указана
  // то нужно показать общее расписание, которе ни к чему не привязано
  // поэтому полагаем что place = 0, ссылка будет примерно следующей
  // schedule/:day/0
  if (!day) {
    return false;
  }

  let page = new Page({
    el: container,
    dayID: day,
    placeID: place
  });
  page.render();

  return page;
};
