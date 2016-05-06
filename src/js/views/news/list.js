'use strict';

import news from '../../collections/news';
import item from './list-item.jade';

let $ = Backbone.$;
let template = _.template(item);

let List = Backbone.View.extend({
  className: 'list-block media-list',
  initialize: function () {
    this.$list = $('<ul />').appendTo(this.$el);

    this.listenTo(news, 'add', this.addItem);
  },
  addItem: function (item) {
    this.$list.append( template( item.toJSON() ) );
  },
  render: function () {
    return this;
  }
});

export default List;
