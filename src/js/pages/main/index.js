'use strict';

import template from './page.jade';

/** @type {function|jQuery} */
let $ = Backbone.$;

module.exports = function (el) {
  let $page = $(el);
  $page.html(template);
};
