import Place from '../models/place';

let Places = Backbone.Collection.extend({
  url: '/places',
  model: Place,
  sync: Backbone.localforage.sync('places')
});

export {Places};

export default new Places();
