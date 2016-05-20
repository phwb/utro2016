let Day = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    date: '',
    timestamp: 0,
    shiftID: 0,
    sort: 10
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    DATE: 'date',
    SHIFT_ID: 'shiftID',
    TIMESTAMP: 'timestamp',
    SORT: 'sort'
  },
  sync: Backbone.localforage.sync('day')
});

export default Day;
