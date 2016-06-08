'use strict';

import {logger} from '../../app/helpers';
import {PullDown} from '../ui/page';
import {Simple, Item} from '../ui/list';
import _item from './templates/contacts-item.jade';

class ListItem extends Item {
  get className() {
    return 'b-contacts__item';
  }

  get template() {
    return _.template(_item);
  }
}

class List extends Simple {
  get className() {
    return 'b-contacts__lst';
  }

  get Item() {
    return ListItem;
  }
}

class Page extends PullDown {
  initialize() {
    super.initialize();
    this.$list = this.$el.find('.b-contacts');
  }

  addAll() {
    let collection = this.collection;
    let contacts = collection.where({
      placeID: 0,
      active: true
    });

    if (!contacts.length) {
      if (collection.status && collection.status !== 'pending') {
        this.$empty.show();
      }
      return this;
    }

    let view = new List({
      collection: contacts
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }
}

export default Page;
