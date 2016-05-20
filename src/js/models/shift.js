let Shift = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    date: ''
    // selected: false
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    DATE: 'date'
  },
  sync: Backbone.localforage.sync('shift')
});

export default Shift;
