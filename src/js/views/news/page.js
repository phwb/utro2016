'use strict';

import _item        from './templates/page-list-item.jade';
import {SimpleLink} from '../ui/list';
import {PullDown}   from '../ui/page';

class List extends SimpleLink {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'b-news';
  }

  get Item() {
    class Item extends super.Item {
      get tagName() {
        return 'div';
      }

      get template() {
        return _.template(_item);
      }
    }
    return Item;
  }
}

let href = function (model) {
  let id = model.get('id');
  return `news/detail.html?id=${id}`;
};
class Page extends PullDown {
  initialize(params) {
    super.initialize();
    this.href = params.href || href;
    this.$list = this.$el.find('.content-block-inner');
    this.listenTo(this.collection, 'change:active', this.changeActive);
  }

  changeActive() {
    this.addAll();
  }

  addAll() {
    let collection = this.collection;
    if (!collection.length) {
      return this;
    }

    let news = collection.where({active: true});
    let view = new List({
      collection: news,
      href: this.href
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );

    if (!news.length) {
      this.$empty.show();
    }
  }

  addItem(model) {
    this.collection.set(model, {remove: false});
  }
}

export default Page;
