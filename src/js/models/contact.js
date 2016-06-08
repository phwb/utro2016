let Contact = Backbone.Model.extend({
  defaults: {
    id: 0,
    active: true,
    name: '',
    timestamp: 0,
    phone: '',
    email: '',
    placeID: 0,
    photo: '',
    sort: 10
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    TIMESTAMP_X: 'timestamp',
    PHONE: 'phone',
    EMAIL: 'email',
    PLACE_ID: 'placeID',
    PHOTO: 'photo',
    SORT: 'sort'
  },
  sync: Backbone.localforage.sync('contact')
});

export default Contact;
