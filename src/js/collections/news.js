import model from '../models/news';

let News = Backbone.Collection.extend({
  model: model
});

export default new News();
