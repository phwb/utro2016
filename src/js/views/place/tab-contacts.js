'use strict';

import {Simple} from '../ui/list';
import {Contacts, default as allContacts} from '../../collections/contacts';

let place = 0;
class ContactList extends Backbone.View {
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
      console.log('нет ID площадки');
      return this;
    }

    let contacts = this.collection.where({placeID: place});
    let collection = new Contacts(contacts);

    let view = new Simple({
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
