'use strict';

import placePage from '../../views/place/place';

function result(view, Page, {id} = {}) {
  if (!id) {
    return false;
  }
  
  let place = placePage(id);
  if (!place) {
    return false;
  }

  let page = new Page({name: place.page.cid});

  page.navbar = place.navbar.render().$el;
  page.page = place.page.render().$el;

  view.loadContent(page.render());
}

module.exports = result;
