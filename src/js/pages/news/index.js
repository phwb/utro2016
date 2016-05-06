'use strict';

/*import news from '../../collections/news';
import _item from './news-item.jade';
import _page from './page.jade';

/!**
 * @type {jQuery|function}
 *!/
let $ = Backbone.$;

$.getJSON('http://api.utro2016.loc/news')
  /!**
   * @param {object} data
   * @property {array} data.ITEMS
   * @property {array} data.LAST_DATE_UPDATE
   *!/
  .then(data => {
    let items = data.ITEMS;

    /!**
     * @param {object} item
     * @property {number} item.ID
     * @property {string} item.NAME
     * @property {number} item.DATE_CREATE
     * @property {number} item.TIMESTAMP_X
     * @property {string} item.PREVIEW_PICTURE
     *!/
    items.forEach(item => news.add({
        id: item.ID,
        name: item.NAME,
        date: item.DATE_CREATE * 1000,
        timestamp: item.DATE_CREATE * 1000,
        previewPicture: item.PREVIEW_PICTURE
      })
    );
  });

function list(Page) {
  let page = new Page({
    name: 'news',
    title: 'Новости'
  });
  let $content = page.$page.find('.page-content');
  let $page = $(_page).appendTo($content);
  let $list = $page.find('ul');
  let template = _.template(_item);

  news.on('add', item => $list.append( template( item.toJSON() ) ));

  return page.render();
}

function detail(Page, id) {
  let model = news.get(id);

  if (!model) {
    throw new Error(`can't find news with id = ${id}`);
  }

  let page = new Page({
    name: `news-${id}`,
    title: model.get('name')
  });

  return page.render();
}*/

import news from '../../collections/news';
import List from '../../views/news/list';

let $ = Backbone.$;
let list = new List();

$.getJSON('http://api.utro2016.loc/news')
  /**
   * @param {object} data
   * @property {array} data.ITEMS
   * @property {array} data.LAST_DATE_UPDATE
   */
  .then(data => {
    let items = data.ITEMS;
    /**
     * @param {object} item
     * @property {number} item.ID
     * @property {string} item.NAME
     * @property {number} item.DATE_CREATE
     * @property {number} item.TIMESTAMP_X
     * @property {string} item.PREVIEW_PICTURE
     */
    items.forEach(item => news.add({
      id: item.ID,
      name: item.NAME,
      date: item.DATE_CREATE * 1000,
      timestamp: item.DATE_CREATE * 1000,
      previewPicture: item.PREVIEW_PICTURE
    }));
  });

function result(view, Page, {id = 0} = {}) {
  let page = new Page({
    name: 'news',
    title: 'Новости'
  });
  let $content = page.$page.find('.page-content');

  $content.html(list.render().$el);
  view.loadContent(page.render());
}

module.exports = result;
