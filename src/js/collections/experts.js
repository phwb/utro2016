import Expert from '../models/expert';

let Experts = Backbone.Collection.extend({
  url: '/experts',
  model: Expert,
  sync: Backbone.localforage.sync('experts')
});

export {Experts};

export default new Experts();
