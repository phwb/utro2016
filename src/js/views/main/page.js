'use strict';

import config                         from '../../models/config';
import {Places, default as allPlaces} from '../../collections/places';
import {SimpleLink}                   from '../list/index';

class Page extends Backbone.View {
  initialize() {
    // событие происходят в функции initSync()
    // --------------
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    this.listenTo(allPlaces, 'reset', this.addAll);
    this.listenTo(allPlaces, 'sync:ajax.end', this.loadSuccess);

    // так же подписываемя на событие изменения конфига
    // --------------
    // может произойти когда пользователь долго смотрит на экран выбора площадки
    // а в этот момент события «reset» и «sync:ajax.end» уже произошли
    this.listenTo(config, 'change:shiftID', this.changeShift);

    this.$list = this.$el.find('.list-block');
  }

  changeShift() {
    this.addAll(allPlaces);
  }

  /**
   * функция аналогична addAll, добавлена исключительно для отладки событий
   *
   * @param collection
   */
  loadSuccess(collection) {
    this.addAll(collection);
  }

  addAll(collection) {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      console.log('Нужно выбрать смену');
      return this;
    }

    if (!collection.length) {
      console.log('Площадки еще не загрузились');
      return this;
    }

    let places = collection.where({shiftID: shiftID}) || [];
    if (!places.length) {
      console.log('ккая-то исключительная ситуация, не найдены площадки для выбранной смены');
      return this;
    }

    // маленький хак, потом наверно придется переделать
    // для импорта массива в коллекцию
    let col = new Places(places);
    let list = new SimpleLink({
      collection: col,
      href: function (model) {
        let id = model.get('id');
        return `place.html?id=${id}`;
      }
    });

    this.$list.html( list.render().$el );
  }
}

export default Page;
