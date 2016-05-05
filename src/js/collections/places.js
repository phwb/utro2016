import Place from '../models/place';

let Places = Backbone.Collection.extend({
  model: Place
});

export default new Places();
