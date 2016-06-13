'use strict';

import _item        from './templates/page-list-item.jade';
import {logger}     from '../../app/helpers';
import polls        from '../../collections/polls';
import {SimpleLink} from '../ui/list';
import {PullDown}   from '../ui/page';

class List extends SimpleLink {
  get className() {
    return 'b-list__lst';
  }

  get Item() {
    class Item extends super.Item {
      get className() {
        return 'b-list__item';
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
    return polls;
  }

  initialize() {
    super.initialize();
    this.$list = this.$el.find('.b-list');
    this.$el.find('.toolbar-poll').addClass('is-active');
  }

  addAll() {
    let collection = this.collection;
    let polls = collection.where({
      active: true
    });

    this.$list.empty();
    if (!polls.length) {
      if (collection.status !== 'pending') {
        this.$empty.show();
      }

      logger('пустая коллекция', collection.url);
      return this;
    }

    let view = new List({
      collection: polls,
      href: function (model) {
        return `polls/detail.html?id=${model.get('id')}`;
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
