'use strict';

import _item        from './templates/page-list-item.jade';
import news         from '../../collections/news';
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

class Page extends PullDown {
  get collection() {
    return news;
  }

  initialize() {
    super.initialize();
    this.$list = this.$el.find('.content-block-inner');
  }

  addAll() {
    let collection = this.collection;
    if (!collection.length) {
      if (collection.status && collection.status !== 'pending') {
        this.$empty.show();
      }
      return this;
    }

    let view = new List({
      collection: collection,
      href: function (model) {
        let id = model.get('id');
        return `news/detail.html?id=${id}`;
      }
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }

  addItem(model) {
    this.collection.set(model, {remove: false});
  }
}

export default Page;
