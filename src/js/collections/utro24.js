'use strict';

import NewsItem from '../models/news-item';

let Utro24 = Backbone.Collection.extend({
  url: '/utro24',
  model: NewsItem,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('utro24')
});

export {Utro24};

export default new Utro24();
