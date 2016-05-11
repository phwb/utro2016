import Day from '../models/day';

let Days = Backbone.Collection.extend({
  url: '/days',
  model: Day,
  sync: Backbone.localforage.sync('days')
});

export default new Days();
