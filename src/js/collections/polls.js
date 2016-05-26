'use strict';

import Poll from '../models/poll';

let Polls = Backbone.Collection.extend({
  url: '/polls',
  model: Poll,
  comparator: function (model) {
    return model.get('id');
  },
  sync: Backbone.localforage.sync('polls')
});

export {Polls};

export default new Polls();
