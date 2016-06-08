'use strict';

let ScheduleItem = Backbone.Model.extend({
  defaults: {
    id: 0,
    active: true,
    name: '',
    type: 'html',
    text: '',
    timestamp: 0,
    start: '00:00',
    end: 0,
    location: 'Не указано',
    // зависимые поля, по ним строятся выборки
    placeID: '0',
    dayID: 0,
    sort: 10,
    // флаг добавления в "Мое расписание"
    my: false
  },
  toggle: function() {
    let my = !this.get('my');
    this.save({
      my: my
    });
    return my;
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    TEXT_TYPE: 'type',
    TEXT: 'text',
    TIMESTAMP_X: 'timestamp',
    TIME_START: 'start',
    TIME_END: 'end',
    PLACE_ID: 'placeID',
    PLACE_STR: 'location',
    DAY_ID: 'dayID',
    SORT: 'sort'
  },
  sync: Backbone.localforage.sync('schedule-item')
});

export default ScheduleItem;
