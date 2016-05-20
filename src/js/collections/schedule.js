'use strict';

import ScheduleItem from '../models/schedule-item';

let Schedule = Backbone.Collection.extend({
  url: '/schedule',
  model: ScheduleItem,
  comparator: function (model) {
    return model.get('sort');
  },
  sync: Backbone.localforage.sync('schedule')
});

export {Schedule};

export default new Schedule();
