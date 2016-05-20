'use strict';

import Expert from '../models/expert';

let Experts = Backbone.Collection.extend({
  url: '/experts',
  model: Expert,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('experts')
});

export {Experts};

export default new Experts();
