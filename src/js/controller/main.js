'use strict';

import places from '../collections/places';
import {SimpleLink} from '../views/list/index';

class Page extends Backbone.View {
  initialize() {
    // событие происходят в функции initSync()
    //
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    this.listenTo(this.collection, 'reset', this.addAll);
    this.listenTo(this.collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.list-block');
  }

  loadSuccess(collection) {
    this.addAll(collection);
  }

  addAll(collection) {
    if (!collection.length) {
      console.log('Площадки еще не загрузились');
      return this;
    }

    let list = new SimpleLink({
      collection: collection,
      href: function (model) {
        let id = model.get('id');
        return `place.html?id=${id}`;
      }
    });
    this.$list.html( list.render().$el );
  }
}

module.exports = function (container) {
  return new Page({
    collection: places,
    el: container
  });
};
