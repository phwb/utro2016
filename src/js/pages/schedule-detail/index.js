'use strict';

import detailPage from '../../views/schedule/detail';

function result(view, Page, {arg0} = {}) {
  let id = arg0;
  if (!id) {
    return false;
  }

  let detail = detailPage(id);
  if (!detail) {
    return false;
  }

  let page = new Page({name: detail.page.cid});
  page.navbar = detail.navbar.render().$el;
  page.page = detail.page.render().$el;

  view.loadContent(page.render());
}

module.exports = result;
