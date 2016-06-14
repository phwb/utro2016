'use strict';

import NewsItem from '../models/news-item';

let News = Backbone.Collection.extend({
  url: '/news',
  model: NewsItem,
  comparator: function (model) {
    return -model.get('date');
  },
  sync: Backbone.localforage.sync('news')
});

export {News};

export default new News();
