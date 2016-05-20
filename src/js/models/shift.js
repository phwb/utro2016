let Shift = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    date: '',
    sort: 10
    // selected: false
  },
  syncMap: {
    ID: 'id',
    NAME: 'name',
    DATE: 'date',
    SORT: 'sort'
  },
  sync: Backbone.localforage.sync('shift')
});

export default Shift;
