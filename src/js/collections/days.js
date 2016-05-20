'use strict';

import Day from '../models/day';

let Days = Backbone.Collection.extend({
  url: '/days',
  model: Day,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('days')
});

export {Days};

export default new Days();
