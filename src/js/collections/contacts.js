'use strict';

import Contact from '../models/contact';

let Contacts = Backbone.Collection.extend({
  url: '/contacts',
  model: Contact,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('contacts')
});

export {Contacts};

export default new Contacts();
