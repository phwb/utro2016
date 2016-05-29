'use strict';

import NotifyItem from '../models/notify-item';

let Notify = Backbone.Collection.extend({
  url: '/notify',
  model: NotifyItem,
  sync: Backbone.localforage.sync('notify'),
  comparator: function (model) {
    return -model.get('timestamp');
  },
  viewed: function () {
    this.each(this._viewed, this);
  },
  _viewed: function (model) {
    if (!model.get('isNew')) {
      return this;
    }
    model.viewed();
  }
});

export {Notify};

export default new Notify();
