import ScheduleItem from '../models/schedule-item';

let Schedule = Backbone.Collection.extend({
  url: '/schedule',
  model: ScheduleItem,
  sync: Backbone.localforage.sync('schedule')
});

export {Schedule};

export default new Schedule();
