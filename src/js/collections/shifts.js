'use strict';

import Shift from '../models/shift';

let Shifts = Backbone.Collection.extend({
  url: '/shifts',
  model: Shift,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('shifts')
});

export default new Shifts();
