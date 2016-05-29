'use strict';

let NotifyItem = Backbone.Model.extend({
  defaults: {
    id: '0',
    author: '',
    text: '',
    timestamp: 0,
    isNew: true
  },
  viewed: function() {
    this.save({
      isNew: false
    });
  },
  syncMap: {
    ID: 'id',
    AUTHOR: 'author',
    TEXT: 'text',
    TIMESTAMP: 'timestamp'
  },
  sync: Backbone.localforage.sync('notify-item')
});

export default NotifyItem;
