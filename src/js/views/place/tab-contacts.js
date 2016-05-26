'use strict';

import _item                              from './templates/detail-contacts-item.jade';
import {logger}                           from '../../app/helpers';
import {Contacts, default as allContacts} from '../../collections/contacts';
import {Simple, Item}                     from '../ui/list';
import {PullDown}                         from '../ui/page';

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

/** коллекция площадок для выбранной смены */
let selectedCollection;
let place = 0;
class ContactList extends PullDown {
  get className() {
    return 'b-contacts';
  }

  get collection() {
    return allContacts;
  }

  initialize({placeID = 0} = {}) {
    super.initialize();
    place = placeID;
    this.$list = this.$el.find('.b-contacts');
  }

  addAll() {
    if (!place) {
      logger('нет ID площадки');
      return this;
    }

    let collection = this.collection;
    let contacts = collection.where({placeID: place});
    if (!contacts.length) {
      if (collection.status && collection.status !== 'pending') {
        this.$empty.show();
      }
      return this;
    }

    selectedCollection = new Contacts(contacts);
    let view = new List({
      collection: selectedCollection
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }

  addItem(model) {
    // если нет коллекции, то и не чего тут делать
    if (!selectedCollection) {
      return this;
    }

    if (place === model.get('placeID')) {
      selectedCollection.set(model);
    }
  }
}

export default ContactList;
