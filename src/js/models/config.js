let Config = Backbone.Model.extend({
  defaults: {
    shiftID: false
  },
  sync: Backbone.localforage.sync('config')
});

export default new Config();
