'use strict';

import contacts from '../collections/contacts';
import Page from '../views/contacts/page';

module.exports = function (container) {
  let page = new Page({
    collection: contacts,
    el: container
  });
  page.render();
  return page;
};
