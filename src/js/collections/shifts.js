import Shift from '../models/shift';

let Shifts = Backbone.Collection.extend({
  url: '/shifts',
  model: Shift,
  sync: Backbone.localforage.sync('shifts')
});

export default new Shifts();
