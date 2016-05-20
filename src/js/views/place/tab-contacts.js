'use strict';

import _item                              from './templates/detail-contacts-item.jade';
import {logger}                           from '../../app/helpers';
import {Simple, Item}                     from '../ui/list';
import {Contacts, default as allContacts} from '../../collections/contacts';

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

let place = 0;
class ContactList extends Backbone.View {
  get className() {
    return 'b-contacts';
  }

  get collection() {
    return allContacts;
  }

  initialize({placeID = 0} = {}) {
    place = placeID;

    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    if (collection.length) {
      this.addAll();
    }
  }

  loadSuccess() {
    this.addAll();
  }

  addAll() {
    if (!place) {
      logger('нет ID площадки');
      return this;
    }

    let contacts = this.collection.where({placeID: place});
    let collection = new Contacts(contacts);

    let view = new List({
      collection: collection
    });

    this.$el.html( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default ContactList;
