let Place = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    code: '',
    type: 'html',
    text: '',
    timestamp: 0,
    shiftID: 0
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    CODE: 'code',
    DETAIL_TEXT_TYPE: 'type',
    DETAIL_TEXT: 'text',
    TIMESTAMP_X: 'timestamp',
    SHIFT_ID: 'shiftID'
  },
  sync: Backbone.localforage.sync('place')
});

export default Place;
