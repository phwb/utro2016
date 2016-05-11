'use strict';

import news from '../../collections/news';
import item from './list-item.jade';

let $ = Backbone.$;
let template = _.template(item);

class List extends Backbone.View {
  get className() {
    return 'list-block media-list';
  }

  initialize() {
    this.$list = $('<ul />').appendTo(this.$el);
    this.listenTo(news, 'add', this.addItem);

    // news.fetch({reset: true});
  }

  addItem(item) {
    this.$list.append( template( item.toJSON() ) );
  }

  render() {
    return this;
  }
}

export default new List();
