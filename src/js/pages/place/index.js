'use strict';

import _navbar from './navbar.jade';
import _page from './page.jade';

function result(view, Page, {id} = {}) {
  if (!id) {
    return false;
  }
  let pageOptions = {
    name: 'place',
    title: 'Площадки'
  };

  if (id) {
    pageOptions.title += ' ' + id;
  }

  let page = new Page(pageOptions);

  page.navbar = _navbar;
  page.page = _page;

  page.$page.find('#place-timetable').on('show', function () {
    console.log('show timetable');
  });

  view.loadContent(page.render());
  return true;
}

module.exports = result;
