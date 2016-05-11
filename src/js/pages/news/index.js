'use strict';

import news from '../../collections/news';
import list from '../../views/news/list';
import detail from '../../views/news/detail';

let $ = Backbone.$;

$.getJSON('http://api.utro2016.loc/news')
  /**
   * @param {object} data
   * @property {array} data.ITEMS
   * @property {array} data.LAST_DATE_UPDATE
   */
  .then(data => {
    /**
     * @type {object}
     * @property {number} item.ID
     * @property {string} item.NAME
     * @property {number} item.DATE_CREATE
     * @property {number} item.TIMESTAMP_X
     * @property {string} item.PREVIEW_PICTURE
     */
    let items = data.ITEMS;

    items.forEach(item => {
      news.create({
        id: item.ID,
        name: item.NAME,
        date: item.DATE_CREATE * 1000,
        timestamp: item.DATE_CREATE * 1000,
        previewPicture: item.PREVIEW_PICTURE
      });
    });
  });

function result(view, Page, {id = 0} = {}) {
  if (id) {
    detail(id).then(detailPage => {
      let page = new Page({
        name: 'news',
        title: 'Новости'
      });

      page.content = detailPage.render().$el;
      view.loadContent(page.render());
    });
    return true;
  }

  let page = new Page({
    name: 'news',
    title: 'Новости'
  });

  page.content = list.render().$el;
  view.loadContent(page.render());
  return true;
}

module.exports = result;
