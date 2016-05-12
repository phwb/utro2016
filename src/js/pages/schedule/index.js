'use strict';

import schedulePage from '../../views/schedule/schedule';

function result(view, Page, {dayID, placeID} = {}) {
  if (!dayID || !placeID) {
    return false;
  }

  let schedule = schedulePage(dayID, placeID);
  if (!schedule) {
    return false;
  }

  let page = new Page({name: schedule.page.cid});
  page.navbar = schedule.navbar.render().$el;
  page.page = schedule.page.render().$el;

  view.loadContent(page.render());
}

module.exports = result;
