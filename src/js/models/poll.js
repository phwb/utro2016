'use strict';

let Poll = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: 'Неизвестный опрос',
    voted: false
  },
  syncMap: {
    ID: 'id',
    NAME: 'name'
  },
  sync: Backbone.localforage.sync('poll')
});

export default Poll;
