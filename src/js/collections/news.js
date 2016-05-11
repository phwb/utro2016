import NewsItem from '../models/news-item';

let News = Backbone.Collection.extend({
  model: NewsItem,
  sync: Backbone.localforage.sync('news-list')
});

export default new News();
