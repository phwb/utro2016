let Expert = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    type: 'html',
    text: '',
    timestamp: 0,
    photo: '',
    // зависимое поле
    placeID: 0
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    PREVIEW_TEXT_TYPE: 'type',
    PREVIEW_TEXT: 'text',
    TIMESTAMP_X: 'timestamp',
    PLACE_ID: 'placeID',
    PHOTO: 'photo'
  },
  sync: Backbone.localforage.sync('expert')
});

export default Expert;
