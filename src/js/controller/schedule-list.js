'use strict';

import Page from '../views/schedule/page';

module.exports = function (container, {day, place = 0} = {}) {
  // по сути ID площадки не обязательно, если площадка не указана
  // то нужно показать общее расписание, которе ни к чему не привязано
  if (!day) {
    return false;
  }

  let page = new Page({
    el: container,
    day: day,
    place: place
  });
  page.render();

  return page;
};
