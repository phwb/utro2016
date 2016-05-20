'use strict';

import Place from '../models/place';

let Places = Backbone.Collection.extend({
  url: '/places',
  model: Place,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('places')
});

export {Places};

export default new Places();
