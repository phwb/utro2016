let Place = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    shortName: '',
    code: '',
    type: 'html',
    text: '',
    timestamp: 0,
    shiftID: 0,
    sort: 10
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    CODE: 'code',
    DETAIL_TEXT_TYPE: 'type',
    DETAIL_TEXT: 'text',
    TIMESTAMP_X: 'timestamp',
    SHIFT_ID: 'shiftID',
    SHORT_NAME: 'shortName',
    SORT: 'sort'
  },
  sync: Backbone.localforage.sync('place')
});

export default Place;
