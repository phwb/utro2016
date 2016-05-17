'use strict';

import {Simple} from '../list/index';
import {Contacts, default as allContacts} from '../../collections/contacts';

class ContactList extends Backbone.View {
  initialize({placeID = 0} = {}) {
    this.placeID = placeID;

    let collection = this.collection = allContacts;
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
    if (!this.placeID) {
      console.log('нет ID площадки');
      return this;
    }

    let contacts = this.collection.where({placeID: this.placeID});
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
