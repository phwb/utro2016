// настройки приложения будем хранить в модели
// это проще чем каждый раз выбирать из коллекции
// к примеру текущую смену, ее айдишник сразу храниться в настройках
let Config = Backbone.Model.extend({
  defaults: {
    id: 'common',
    shiftID: false
  },
  sync: Backbone.localforage.sync('config')
});

export default new Config();
