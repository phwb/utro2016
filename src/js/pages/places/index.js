'use strict';

function result(view, Page, {id} = {}) {
  let pageOptions = {
    name: 'places',
    title: 'Площадки'
  };

  if (id) {
    pageOptions.title += ' ' + id;
  }

  let page = new Page(pageOptions);
  view.loadContent(page.render());
}

module.exports = result;
