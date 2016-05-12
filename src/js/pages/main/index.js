'use strict';

import Main   from '../../views/main/main';
import Modal  from '../../views/main/modal';
import Menu   from '../../views/main/menu';

/** @type {jQuery|function} */
let $ = Backbone.$;

let main = new Main();
let modal = new Modal();
let menu = new Menu();
// по факту пустые функции, просто чтоб не подсвечивалась в IDE
modal.render();
menu.render();

module.exports = function (el) {
  $(el).html(main.render().$el);
};
