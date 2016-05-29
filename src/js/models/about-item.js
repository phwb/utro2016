'use strict';

let AboutItem = Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
    text: '',
    status: 'OK'
  },
  syncMap: {
    CODE: 'id',
    NAME: 'name',
    VALUE: 'text',
    STATUS: 'status'
  },
  sync: Backbone.localforage.sync('about-item')
});

export default AboutItem;
