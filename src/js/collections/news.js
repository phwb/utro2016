import NewsItem from '../models/news-item';

let News = Backbone.Collection.extend({
  url: '/news',
  model: NewsItem,
  sync: Backbone.localforage.sync('news')
});

export {News};

export default new News();
